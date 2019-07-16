import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Platform } from 'ionic-angular';
import { Global } from '../../global/global';
import { Display } from '../../display/display';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ExtratoDetalhePage } from '../usr_extrato-detalhe/extrato-detalhe';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-extrato',
  templateUrl: 'extrato.html',
})
export class ExtratoPage {

  openStatement: object;
  d: object;
  titlePage: string;	
  segmentTab: any;
  load: any;
  g: any;
  idEmpresa:any;
  idUsuario:any;
  idUsuarioCartao:any;
  cardNumber: string;
  total:any;
  totalVendas:any;
  periodo:any;
  mesSelecionado:any;
  mesesExtrato:any;
  company: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, public translateService: TranslateService, private ga: GoogleAnalytics) {
  	
  	//constantes
    this.g = new Global();
    this.d = new Display();
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    })
	//variaveis
    this.idUsuario = navParams.get('id_ac_usuario');
    this.idUsuarioCartao = navParams.get('id_usuario_cartao');
    this.cardNumber = navParams.get('card_number');
    this.mesesExtrato = this.last12Months();
    this.mesSelecionado = this.currentMonth(); 

    //metodo inicial
    this.defineSegment();
	
	this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
	
	plt.ready().then(() => { 
      /*Google Analytics*/
	  this.ga.startTrackerWithId(this.g.codeGA)
	  .then(() => {
		this.ga.trackView(this.company + '/' + this.titlePage);
	  })
	  .catch(e => console.log('Erro ao iniciar Google Analytics', e));	  
    });
  }

  defineSegment(){
    console.log(this.d);
  	if(this.d['pg_extrato_escondeExtratoAberto'] == false){
  		this.titlePage = 'Extrato aberto';
  		this.segmentTab = 'extrato-aberto';
  		this.apiCardPeriod(this.g.urlApi, { procedimento: 43, id_ac_usuario_cartao: this.idUsuarioCartao, tipo_periodo: 1, data: this.g.currentDate() });
  	}else if(this.d['pg_extrato_escondeExtratoUltimo'] == false){
  		this.titlePage = 'Último aberto';
  		this.segmentTab = 'extrato-ultimo';
  		this.apiCardPeriod(this.g.urlApi, { procedimento: 43, id_ac_usuario_cartao: this.idUsuarioCartao, tipo_periodo: 1, data: this.g.currentDate() });
  	}else{
  		this.titlePage = 'Extrato informado';
  		this.segmentTab = 'extrato-informado';
  		this.genformedStatement();
  	}	
  }
  //segments
  segmentChanged(event, item){
	  switch(item){
	    case 'extrato-aberto':
	      this.titlePage = 'Extrato aberto';
	      this.apiCardPeriod(this.g.urlApi, { procedimento: 43, id_ac_usuario_cartao: this.idUsuarioCartao, tipo_periodo: 1, data: this.g.currentDate() });
	    break;
	    case 'extrato-ultimo':
	      this.titlePage = 'Último extrato';
	      this.apiCardPeriod(this.g.urlApi, { procedimento: 43, id_ac_usuario_cartao: this.idUsuarioCartao, tipo_periodo: 2, data: this.g.currentDate() });
	    break;
	    case 'extrato-informado':
	      this.titlePage = 'Extrato informado';
	      this.genformedStatement();
	    break;          
	  }
  }
  //requisicoes
  apiCardPeriod(url, arraySend){
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
    .map(res => res.json())
      .subscribe(
      data =>{
        if(data.message == 'Sucesso'){
        	let initialDate = data.result[0]['data_inicial'];                      
            let finalDate = data.result[0]['data_final'];
            this.apiStatement(this.g.urlApi, { procedimento: 38, empresa: this.idEmpresa, datainicial: initialDate, datafinal: finalDate, agrupar: 'S', id_ac_usuario: this.idUsuario});
        }else{
          this.toast('Erro ao carregar o período do cartão', '3500', 'top', 'error');
        }
      },  
      err => { this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => console.log('') 
    );
  }
  apiStatement(url, arraySend){
    this.loading('Carregando...');
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
    .map(res => res.json())
      .subscribe(
      data =>{
        if(data.message == 'Sucesso'){          
          let transactions = data.result.filter( (transaction)=> {
            if (transaction.numerocartao == this.cardNumber)
              return transaction;              
          })
          this.openStatement = transactions;         
        
          //soma extrato  
          this.total = this.sumStatement(transactions);
          this.totalVendas = this.sumSales(transactions);
          this.periodo = transactions[0]['periodo'];

          //verifica sem transações
          if(this.totalVendas == 0 || transactions[0]['prestador'] == '* sem transacoes no periodo *'){
            this.totalVendas = 0; 
            this.total = 0;          
          }               
        }else{
          this.toast('Erro ao carregar o extrato aberto', '3500', 'top', 'error');
        }
      },  
      err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => this.load.dismiss() 
    );
  }
  
  //Redireciona para página Detalhe da Venda
  goToStatementDetail(event, saleDetail){
    this.navCtrl.push(ExtratoDetalhePage, {
      detail: saleDetail
    });    
  }
  sumStatement(arr){
      let total = 0;
      for(var i=0; i< arr.length; i++){
        total = total + parseFloat(arr[i]['valor']);
      }
      return total;
  }
  sumSales(arr){     
      for(var i=0; i< arr.length; i++){}
      return i;
  }
  genformedStatement(){
	  let numeroMes = parseInt(this.mesSelecionado.substring(0, 2));
	  let ano = this.mesSelecionado.slice(-4);
	  let initialDate = this.firstDayMonth(numeroMes, ano);
	  let finalDate = this.lastDayMonth(numeroMes, ano);
      this.apiStatement(this.g.urlApi, {procedimento:38 , empresa:this.idEmpresa, datainicial:initialDate, datafinal:finalDate, agrupar:'S', id_ac_usuario:this.idUsuario });
  }
  last12Months(){      
	  let today = new Date();
	  let year = today.getFullYear();
	  let aMonth = today.getMonth();
	  let months = [], i;
	  let month = new Array('01-Janeiro', '02-Fevereiro', '03-Março', '04-Abril', '05-Maio', '06-Junho','07-Julho', '08-Agosto', '09-Setembro', '10-Outubro', '11-Novembro', '12-Dezembro');
	  for (i=0; i<12; i++) {
	   months.push(month[aMonth] + '/' + year);
	   aMonth--;
	   if (aMonth < 0) {
	    aMonth = 11;
	    --year;
	   }
	  }
	  return months;
  }
  currentMonth(){
	  let names = new Array('01-Janeiro', '02-Fevereiro', '03-Março', '04-Abril', '05-Maio', '06-Junho','07-Julho', '08-Agosto', '09-Setembro', '10-Outubro', '11-Novembro', '12-Dezembro');
	  let d = new Date();
	  let m = names[d.getMonth()];
	  let y = new Date().getFullYear();
	  let mAtual = m + '/' + y;
	  return mAtual;
  }
  firstDayMonth(m, y){
    var d = '01';
    let data =  y +'.' + m + '.' + d;
    return data;
  }
  lastDayMonth(m, y) {     
	let ultimoDia = m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
	let data = y+'.' + m + '.' + ultimoDia;
	return data;
  }

  //loading
  loading(title){
    this.load = this.loadingCtrl.create({
      content: '<h5>'+title+'</h5>'
    });
    this.load.present();
  }
  //toast
  toast(message, duration, position, cssClass){
    let toast = this.toastCtrl.create({
        message: message,
        duration: duration,
        position: position,
        cssClass: cssClass,
        dismissOnPageChange: true,
        showCloseButton: true,
        closeButtonText: 'Ok'
    });
    toast.present();
  }  
}