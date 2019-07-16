import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ExtratoVendaDetalhePage } from '../rcd_extrato-venda-detalhe/extrato-venda-detalhe';

@IonicPage()
@Component({
  selector: 'page-extrato-venda',
  templateUrl: 'extrato-venda.html',
})
export class ExtratoVendaPage {
  
  g: any;
  load: any;
  company: number;
  idCompany: number;
  titlePage: string;
  extract: any;
  extractMonths: any;
  selectMonth: string;
  showGenerate: boolean = false;
  showExtract: boolean = true;
  total: number;
  salesTotal: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public translateService: TranslateService, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics, ){
    this.g = new Global();
    
    //ultimos 12 meses
    this.extractMonths = this.last12Months();
    this.selectMonth = this.currentMonth();

    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });

    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idCompany = value;
    });

    this.translateService.get('PR_REDE-CREDENCIADA-PG-EXTRATO-VENDAS-TITULO').subscribe((value) => {
      this.titlePage = value;
    });

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA)
      .then(() => {
      this.ga.trackView(this.company + '/' + this.titlePage);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });

    this.extractGenerate();
  }

  goToExtractDetail(extractItem){
    this.navCtrl.push(ExtratoVendaDetalhePage, {
      extractItem: extractItem
    });
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
    let cMonth = m + '/' + y;

    return cMonth;      
  }

  firstDayMonth(m, y){        
    let d = '01';     
    let date =  y +'.' + m + '.' + d;
    return date;
  }

  lastDayMonth(m, y) {      
    let lastDay = m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
    let date = y+'.' + m + '.' + lastDay;
    return date;
  }

  extractSum(arr){
    let total = 0;
    
    for(var i=0; i< arr.length; i++){
      total = total + arr[i]['valor'];
    }
    return total;
  }

  salesSum(arr){  
    for(var i=0; i < arr.length; i++){}
    return i;
  }

  extractGenerate(){
    //exibição    
    this.showGenerate = false;
    this.showExtract = true;  
    this.total = 0;
    
    let monthNumber = parseInt(this.selectMonth.substring(0, 2));
    let year = this.selectMonth.slice(-4);

    console.log('Primeiro dia do mês -> ' + this.firstDayMonth(monthNumber, year));
    console.log('Ultimo dia do mês -> ' + this.lastDayMonth(monthNumber, year));

    let initialDate = this.firstDayMonth(monthNumber, year);
    let finalDate = this.lastDayMonth(monthNumber, year);

    this.saleExtractConsume(41, this.idCompany, localStorage.getItem("merchantName"), localStorage.getItem("merchantName"), 3, initialDate, finalDate, null, null, null, "D");
  }

  saleExtractConsume(procedimento, empresa, nome_fantasiainicial, nome_fantasiafinal, tipoperiodo, datainicial, datafinal, representante, cidadeinicial, cidadefinal, ordem){          
        
    let body = JSON.stringify({procedimento: procedimento, empresa: empresa, nome_fantasiainicial: nome_fantasiainicial, nome_fantasiafinal: nome_fantasiafinal, tipoperiodo: tipoperiodo, datainicial: datainicial, datafinal: datafinal, representante: representante, cidadeinicial: cidadeinicial, cidadefinal: cidadefinal, ordem: ordem});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });    
    let url = this.g.urlApi;
      
    this.http.post(url, body, options)
    .map(res => res.json())
    .subscribe(
      data =>{

        //verifica retorno da api        
        if(data.message == 'Sucesso'){            
          this.extract = data.result;
          this.showGenerate = true;
          this.showExtract = false;
          
          //soma extrato  
          this.total = this.extractSum(data.result);
          this.salesTotal = this.salesSum(data.result);
        }else if(data.message == 'Retornou vazio'){
          this.toast('Sem transações no período', 1500, 'top', 'notice');
          this.showGenerate = true;
          this.total = 0;
        
        }else{            
          this.toast('Não foi possível carregar o extrato', 1500, 'top', 'error');
          this.showGenerate = true;
          this.total = 0;
        }
      },  
      err => { console.log(err); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); this.showGenerate = true; this.total = 0;},
      () => console.log('Consumiu Extrato Rede Credenciada') 
    );
  }

  //Componentes 

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
