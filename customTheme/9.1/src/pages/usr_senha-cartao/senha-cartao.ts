import { Component, ViewChild, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { TabsPrincipalPage } from '../usr_tabs-principal/tabs-principal';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';

@IonicPage()
@Component({
  selector: 'page-senha-cartao',
  templateUrl: 'senha-cartao.html',
})
export class SenhaCartaoPage implements OnInit {

  @ViewChild(IonDigitKeyboardCmp) keyboard;

  passwordCard: string = '';
  objSend: object;
  g: any;
  load: any;
  btnEntrar: any;
  idEmpresa:any;
  typePassword:any;
  focus: string = '';
  company: string;
  title: string;

  public keyboardSettings: IonDigitKeyboardOptions = {
      align: 'center',
      //width: '85%',
      visible: true,
      leftActionOptions: {
          iconName: 'ios-backspace-outline',
          fontSize: '1.4em'
      },
      rightActionOptions: {
          iconName: 'ios-checkmark-circle-outline',
          text: '.',
          fontSize: '1.3em'
      },
      roundButtons: false,
      showLetters: false,
      swipeToHide: true,
      // Available themes: IonDigitKeyboard.themes
      theme: 'ionic'
  };
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public storage: Storage, public plt: Platform, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics){
    this.g = new Global();
    //botoes    
    this.btnEntrar = null;
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    });
    this.translateService.get('CG_TIPO_SENHA_LOGIN').subscribe((value) => {
      this.typePassword = value;
    });
    
	this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
	this.translateService.get('PG_SENHA-CARTAO_TITULO').subscribe((value) => {
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
	
	//foco campo inicial
    this.focus ='passwordCard';
	
  }

  //submit o form
  registerPass(){
   if(this.navParams.get('cpfNumber')){
       this.objSend = {
        procedimento: 56,
        p_empresa: this.idEmpresa,
        p_cpf: this.navParams.get('cpfNumber'),
        p_senha: this.passwordCard,
        p_tipo_senha: this.typePassword,
        p_token: '',
        p_plataforma: this.platformNameOs(),
        p_numero_celular: '',
        p_operadora: ''
       }
    }else{
       this.objSend = {
        procedimento: 57,
        p_empresa: this.idEmpresa,
        p_numero_cartao: this.navParams.get('cardNumber'),
        p_senha: this.passwordCard,
        p_tipo_senha: this.typePassword,
        p_token: '',
        p_plataforma: this.platformNameOs(),
        p_numero_celular: '',
        p_operadora: ''
      }
    }  
    this.apiUserLogin(this.g.urlApi, this.objSend);
  } 
  //requisicoes
  apiUserLogin(url, arraySend){
    //console.log(arraySend);
    let typeMessage = (arraySend.procedimento == 56)? 'CPF': 'Cartão'; 
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        if(data.message == 'Sucesso'){
            if(data.result[0]['r_status'] == 0){
              //salva dados do usuario
              this.objSend['p_estado_usuario'] = data.result[0]['r_estado'];
              this.objSend['p_cidade_usuario'] = data.result[0]['r_id_cidade'];
              this.storage.set('userData', this.objSend);
              this.navCtrl.push(TabsPrincipalPage,{
                cards: data.result
              });
            } else {

              //console.log(data.result[0]['r_status']);

              if(data.result[0]['r_status'] == 3){
                this.passwordCard = '';
                this.toast('Dados cadastrais incompletos ou inválidos! Entre em contato com a Administradora.', '3500', 'top', 'error');
              } else{
                this.passwordCard = '';
                this.toast(typeMessage + ' ou Senha incorretos ou inválidos', '3500', 'top', 'error');
              }
            }
        }else{
          this.passwordCard = '';
          this.toast('CPF ou Senha incorretos ou inválidos', '3500', 'top', 'error');
        }
      },  
      err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => this.load.dismiss() 
    );
  }
  clear(){
    //this.vibration.vibrate(50);
    this.passwordCard = '';
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
  //platform
  platformNameOs(){
    let nameOs;
    if(this.plt.is('ios')) {
      nameOs = 'ios';
    }else if(this.plt.is('android')){
      nameOs = 'android';
    }else if(this.plt.is('windows')){
      nameOs = 'windows-phone';
    }else{
      nameOs = 'desconhecido';
    }
    return nameOs;
  }
  //Keyboard
  ngOnInit(): void {
    this.keyboard.onClick.subscribe((key: any) => {
      let field = this.focus;
      //this.vibration.vibrate(50);
      if (typeof key == 'number') {
        if(this[field].length >= 6){
          this[field] = this[field].substring(0, this[field].length - 1);
        }else{
          this[field] += key;
        }
      } else {
        if (key == 'left') this[field] = this[field].substring(0, this[field].length - 1);
        if (key == 'right') this.registerPass();  
      }
    });
    this.keyboard.onHide.subscribe(() => {
        this.focus = '';
    });
  }
  setFocus(field: string) {
    this.focus = field;
    this.keyboard.show();
  }
  //Keyboard
  /*token
  uuid(){
    let token;
    if(this.device.uuid){
      token = this.device.uuid;
    }else{
      token = 'desconhecido';
    }
    return token;   
  }
  */

}