import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController, ToastController, LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  load: any;
  g: any;
  endPointApi: string;
  platform: string;
  card: object;
  company: string;
  companyId: number;
  pageTitle: string;
  name: string = '';
  email: string = '';  
  content: string = '';
  phone: string = '';
  msg: string = '';
  cardNumber: string = '';
  emails: any;
  uuid: string;

  //public alertCtrl: AlertController,
  constructor(public navCtrl: NavController, public plt: Platform, public navParams: NavParams, public alertCtrl: AlertController, public viewCtrl: ViewController, public modalCtrl: ModalController, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, public storage: Storage, private device: Device, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics) {
    this.g = new Global();   
    
    this.endPointApi = this.g.urlApi;
    this.emails = [];

    this.uuid = '0';

    if( this.device.uuid != 'undefined' || this.device.uuid != null){
      this.uuid = this.device.uuid;
    }

    this.platform = plt._platforms[1];    

    //titulo da pagina
    this.translateService.get('PG_SUGESTOES_TITULO').subscribe((value) => {
      this.pageTitle = value;
    });
    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.companyId = value;
    });
    
    this.getCompanyEmails(53, this.companyId);

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA).then(() => {
        this.ga.trackView(this.company + '/' + this.pageTitle);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });
  }

  validates(){
    if(this.name.length < 3){
      this.toast('Por favor preencha um nome válido.', 4500, 'top', 'error'); 
    }else if(this.email.length < 5){
      this.toast('Por favor preencha um e-mail válido.', 4500, 'top', 'error'); 
    }else if(this.phone.length < 10){
      this.toast('Por favor preencha um celular válido.', 4500, 'top', 'error');
    }else if(this.content == "0"){
      this.toast('Por favor escolha um assunto.', 4500, 'top', 'error');
    }else if(this.msg.length < 5){
      this.toast('Por favor escreve uma mensagem válida.', 4500, 'top', 'error');
    }else{
      this.sendFeedback();      
    }
  }

  sendFeedback(){
    //this.cardMask(this.cardNumber)

    //carregando
    this.loading('Enviando...');
    console.log(this.companyId);
    let Name = this.name;
    let Subject = 'FeedBack App Mobile ' + this.platformDefine() + ' - '+this.company+' - '+ this.content;
    let Email = this.emails.toString();  
    let Message = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'><html lang='en'><head> <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta name='format-detection' content='telephone=no'> <title>Contato App</title> <style type='text/css'>body{margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}table{border-spacing: 0;}table td{border-collapse: collapse;}.ExternalClass{width: 100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height: 100%;}.ReadMsgBody{width: 100%; background-color: #ebebeb;}table{mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}.yshortcuts a{border-bottom: none !important;}@media screen and (max-width: 599px){.force-row, .container{width: 100% !important; max-width: 100% !important;}}@media screen and (max-width: 400px){.container-padding{padding-left: 12px !important; padding-right: 12px !important;}}.ios-footer a{color: #aaaaaa !important; text-decoration: underline;}</style></head><body style='margin:0; padding:0;' bgcolor='#F0F0F0' leftmargin='0' topmargin='0' marginwidth='0' marginheight='0'><table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0' bgcolor='#F0F0F0'> <tr> <td align='center' valign='top' bgcolor='#F0F0F0' style='background-color: #F0F0F0;'> <br><table border='0' width='600' cellpadding='0' cellspacing='0' class='container' style='width:600px;max-width:600px'> <tr> <td class='container-padding header' align='left' style='font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px'> <img height='30px' src='https://cdn.orgcard.com.br/produtos/mobile/img/logos_clientes/png/email/" + this.companyId + ".png'> </td></tr><tr> <td class='container-padding content' align='left' style='padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff'> <br><div class='title' style='font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550'> Contato Aplicativo " + this.platformDefine() + "</div><br><div class='body-text' style='font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333'><b>Nome:</b> " + this.name + "<br><b>Número do cartão:</b> " + this.cardNumber + "<br><b>E-mail:</b> " + this.email + "<br><b>Celular:</b> " + this.phone + "<br><b>Mensagem:</b><br>" + this.msg + "<br><br></div></td></tr></table> </td></tr></table></body></html>";
    let body = JSON.stringify({Name: Name, Email: Email, Subject: Subject, Message: Message});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let url = 'https://api-pos.orgcard.com.br/v1/enviaemail';
    this.http.post(url, body, options)
      .map(res => res.json())
      .subscribe(
        data =>{          
          //verifica retorno da api
          if(data.success == true){              
            this.feedbackRegister(50, this.content, this.phoneRemoveMask(this.phone), this.email, this.companyId, this.msg, this.name, this.platformDefine(), this.uuid); 
            //this.toast("Sua mensagem foi enviada com sucesso, agradecemos seu feedback.", '4500', "top", "success");

            this.confirmSendMail();
          }else{
            this.toast("Não foi possível enviar seu comprovante, por favor tente novamente.", 4500, "top", "notice");
          }
        },  
        err => console.log(err),
      () => this.load.dismiss()//, console.log('Enviou') 
    );
  }

  feedbackRegister(proc, content, phone, email, company, msg, name, platform, token){
    let body = JSON.stringify({procedimento: proc, p_assunto: content, p_celular: phone, p_email: email, p_empresa: company, p_mensagem: msg, p_nome: name, p_plataforma: platform, p_token: token});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers }); 
    let url = this.endPointApi;
    this.http.post(url, body, options)
      .map(res => res.json())
      .subscribe(
        data =>{
            //verifica retorno da api
            if(data.message == 'Sucesso'){                                  
              this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));
            }else{              
          }
        },  
        err => console.log(err),
      () => console.log('Registrou') 
    );
  }

  //get card administrator contacts.
  getCompanyEmails(proc, company){
    //carregando
    this.loading('Carregando...');
    
    let body = JSON.stringify({procedimento: proc, p_empresa: company});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers }); 
    let url = this.endPointApi;    
    this.http.post(url, body, options)
      .map(res => res.json())
      .subscribe(
        data =>{
          if(data.message == 'Sucesso'){                    
            for(let i = 0; i < data.result.length; i++){
              this.emails.push(data.result[i]['r_email']);                       
            }
          }else{
            this.toast("Não foi possível retornar os dados da empresa", 4500, "top", "error");
          }
        },  
        err => { console.log(err); this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', 4500, 'top', 'notice'); },
      () => this.load.dismiss()//, console.log('Consumiu Dados ') 
    );
  }

  platformDefine(){
    let localPlatform;
    
    if(this.platform == "ios"){
        localPlatform = 'IOS-Iphone';
    }else if(this.platform == "android"){
        localPlatform = 'Android';
    }else if(this.platform == "windows"){
        localPlatform = 'Windows-Phone';
    }else{
      localPlatform = 'Web';
    }
    return localPlatform;
  }

  phoneRemoveMask(value){
    let newValue = value.replace(/\D/g,'');
    return newValue;
  }

  cardMask(card){
    let index;
    if(card.length == 19){
      index = 5;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 6;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 7;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 8;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 10;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 11;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 12;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 13;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
    }else if(card.length == 21){
      index = 7;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 8;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 9;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 10;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 12;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 13;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 14;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
      index = 15;
      card = card.substr(0, index) + '*' + card.substr(index + 1);
    }
    return card;
  }

  phoneFormat(ev){
    ev.target.value = ev.target.value.replace(/\D/g,"");            
    ev.target.value = ev.target.value.replace(/^(\d{2})(\d)/g,"($1) $2"); 
    ev.target.value = ev.target.value.replace(/(\d)(\d{4})$/,"$1-$2");   
  }

  cardFormat(ev){                         
    let newCard = ev.target.value.split(" ").join(""); 
    if(ev.target.value.length < 20){         
      if (newCard.length > 0) {
        newCard = newCard.match(new RegExp('.{1,4}', 'g')).join(" ");
      }
    }else{
      newCard = [newCard.slice(0, 6), ' ', newCard.slice(6)].join('');
      newCard = [newCard.slice(0, 11), ' ', newCard.slice(11)].join('');
      newCard = [newCard.slice(0, 16), ' ', newCard.slice(16)].join('');
    }    
    ev.target.value = newCard;                   
  }

  //Componentes

  //loading
  loading(title){
    this.load = this.loadingCtrl.create({
      content: '<h5>'+title+'</h5>'
    });
    this.load.present();
  }

  confirmSendMail(){
  	let alert = this.alertCtrl.create({
	    title: 'Confirmação',
      message: 'E-mail enviado com sucesso. <br />A resposta será enviada para <br /> o seu e-mail.',
	    buttons: ['OK']
    });
    
    alert.present();
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