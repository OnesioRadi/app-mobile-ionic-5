import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Platform } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ChatPage } from '../chat/chat';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-contato',
  templateUrl: 'contato.html',
})
export class ContatoPage {

  load: any;
  g: any;
  idEmpresa: any;
  nameCompany: string;
  publicPlace: string;
  address: string;  
  neighborhood: string;
  number: string;
  city: string;
  uf: string;
  cep: string;
  phone: string;
  fax: string;
  company: string;
  title: string;
  hidePhone: boolean;
  hidefax: boolean;
  hideWa: boolean;
  constructor(public navCtrl: NavController, public plt: Platform, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public http: Http, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics) {
  	this.g = new Global();
	
	this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    })
	this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
	this.translateService.get('PG_CONTATO_TITULO').subscribe((value) => {
      this.title = value;
    })
	
	plt.ready().then(() => { 
      /*Google Analytics*/
	  this.ga.startTrackerWithId(this.g.codeGA)
	  .then(() => {
		this.ga.trackView(this.company + '/' + this.title);
	  })
	  .catch(e => console.log('Erro ao iniciar Google Analytics', e));	  
    });
   
  	this.apiInfoCompany(this.g.urlApi,{ procedimento: 39, empresa: this.idEmpresa });
  	this.hidePhone = true;
  	this.hidefax = true;
  	this.hideWa = true;
  }
  apiInfoCompany(url, arraySend){
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        if(data.message == 'Sucesso'){
          this.nameCompany = data.result[0]['nomeempresa'];
  	      this.publicPlace = data.result[0]['logradouro'];
  	      this.address = data.result[0]['endereco'];  
  	      this.neighborhood = data.result[0]['bairro'];
  	      this.number = data.result[0]['numero'];
  	      this.city = data.result[0]['cidadeempresa'];
  	      this.uf = data.result[0]['estado'];
  	      this.cep = data.result[0]['cep'];
  	      this.phone = data.result[0]['fone'];
  	      this.fax = data.result[0]['fax'];

          if (this.phone != '' && this.phone != null){
            this.phone = this.g.onlyNumbers(this.phone);
            this.phone = this.g.formatPhone(this.phone);  
            this.hidePhone = false;                      
          }
                  
          if (this.fax != '' && this.fax != null){
            this.fax = this.g.onlyNumbers(this.fax);
            this.fax = this.g.formatPhone(this.fax);
            this.hidefax = false;
          }        

	        if (this.phone == this.fax){            
            this.hidePhone = true;                      
          } 
        }else{
          this.toast('Erro ao carregar os dados da empresa', '3500', 'top', 'error');
        }
      },  
      err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => this.load.dismiss() 
    );
  }
  goToChat(){
	//this.vibration.vibrate(50);   
  	this.navCtrl.push(ChatPage);
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
