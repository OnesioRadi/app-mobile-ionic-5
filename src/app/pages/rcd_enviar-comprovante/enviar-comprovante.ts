import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-enviar-comprovante',
  templateUrl: 'enviar-comprovante.html',
})

export class EnviarComprovantePage {
  load: any;
  g: any;
  card: object;
  company: string;
  companyLowCase: string;
  companyId: number;
  companyLogo: string;
  pageTitle: string;
  userMail: string;
  userPhone: string;
  emailCoupon: any;
  smsCoupon: any;
  relation: string;
  pageCount: number;
  
  constructor(public navCtrl: NavController, public plt: Platform, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, public storage: Storage, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics) {
    this.g = new Global();
    
    this.pageCount = navParams.get("pageCount");
    
    //Constants
    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });

    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.companyLowCase = value.toLowerCase();
    });

    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.companyId = value;
    });

    this.translateService.get('CG_LOGO_BRANCA').subscribe((value) => {
      this.companyLogo = value;
    });
    
    this.relation = 'email';
    this.userMail = '';
    this.userPhone = '';      
    
    //parametros recebidos     
    this.emailCoupon = navParams.get("emailCoupon");
    this.smsCoupon = navParams.get("emailSms");
          
    //titulo da pagina
    this.translateService.get('PR_REDE_CREDENCIADA-PG-ENVIAR-COMPROVANTE').subscribe((value) => {
      this.pageTitle = value;
    });

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA).then(() => {
        this.ga.trackView(this.company + '/' + this.pageTitle);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });  
  }

  close(){
    this.pageCount++;
    console.log(this.pageCount);
    this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-this.pageCount));
  }

  sendMail(){    
    if(this.mailValidates(this.userMail) == true){
      this.loading('Enviando...');              

      let Name = this.company;
      let Subject = 'Comprovante de Pagamento - ' + this.company;
      let Email = this.userMail;  
      let Message = "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'><html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no'/><title>Cupom</title><style type='text/css' media='screen'>.ExternalClass * {line-height: 100%}@media only screen and (max-width: 480px) { *[id=email-penrose-conteneur] {width: 100% !important;} table[class=resp-full-table] {width: 100%!important; clear: both;} td[class=resp-full-td] {width: 100%!important; clear: both;} img[class='email-penrose-img-header'] {width:100% !important; max-width: 340px !important;} }</style></head><body style='background-color:#333333'><div align='center' style='background-color:#333333;'><table id='email-penrose-conteneur' width='660' align='center' style='padding:20px 0px;' border='0' cellspacing='0' cellpadding='0'><tr><td><table width='660' class='resp-full-table' align='center' border='0' cellspacing='0' cellpadding='0'><tr><td width='50%' style='text-align:left;'></td><td width='50%' style='text-align:right;'><table align='right' border='0' cellspacing='0' cellpadding='0'><tr></tr></table></td></tr></table></td></tr></table><table id='email-penrose-conteneur' width='660' align='center' style='border-right:1px solid #FFDD75; border-bottom:1px solid #FFDD75; border-left:1px solid #FFDD75; background-color:#ffffff;' border='0' cellspacing='0' cellpadding='0'><tr><td style='background-color:#FFE599'><table width='660' class='resp-full-table' align='center' border='0' cellspacing='0' cellpadding='0'><tr><td class='resp-full-td' valign='top' style='padding:20px; text-align:center;'><span style='font-size:32px; font-family:'Helvetica Neue', helvetica, arial, sans-serif; font-weight:100; color:#ffffff'><span style='color:#333333; outline:none; text-decoration:none;'> <img width='auto' height='40px' src='https://cdn.orgcard.com.br/produtos/white_logo/logo_"+this.removeSpaces(this.companyLowCase)+".png'/><br><h3>Comprovante de Pagamento</h3></span></span></td></tr><tr><td width='100%' class='resp-full-td' valign='top' style='padding: 0px 20px 20px 20px;'><table align='center' border='0' cellspacing='0' cellpadding='0' style='margin:auto; padding:auto;'><tr><td style='background-color:#ffffff; border-radius:3px; padding: 10px 40px;'>"+this.emailCoupon+"</td></tr></table></td></tr><tr><td width='100%' valign='top'><table align='center' border='0' cellspacing='0' cellpadding='0' style='margin:auto; padding:auto;'><tr><td style='text-align:center; padding:0px 20px;'></td></tr></table></td></tr></table></div></body></html>";
      
      let body = JSON.stringify({Name: Name, Email: Email, Subject: Subject, Message: Message});
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let url = 'https://api-pos.orgcard.com.br/v1/enviaemail';

      this.http.post(url, body, options)
      .map(res => res.json())
      .subscribe(
        data =>{
          if(data.success == true){              
              this.toast('Comprovante enviado com sucesso', 1500, 'top', 'success');
          }else{
            this.toast('Não foi possível enviar seu comprovante, por favor tente novamente.', 1500, 'top', 'error');
          }
        },  
        err => console.log(err),
        () => this.load.dismiss()//, console.log('Enviou') 
      );
    }else{
      this.toast('Email inválido!', 1500, 'top', 'error');
    }              
  }

  //componentes
  mailValidates(email){    
    let regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  }

  phoneFormat(ev){
     ev.target.value = ev.target.value.replace(/\D/g,"");            
     ev.target.value = ev.target.value.replace(/^(\d{2})(\d)/g,"($1) $2"); 
     ev.target.value = ev.target.value.replace(/(\d)(\d{4})$/,"$1-$2");     
  }

  numberOnly(n){
    let numbers = n.replace(/\D/g,'');
    return numbers; 
  }

  removeSpaces(str){
    str = str.replace(/ /g,'');
    return str;   
  }

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
