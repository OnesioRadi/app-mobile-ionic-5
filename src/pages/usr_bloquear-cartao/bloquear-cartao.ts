import { Component, ViewChild, OnInit} from '@angular/core';
import { App, IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, Platform, PopoverController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { Http, Headers, RequestOptions } from '@angular/http';
import { TabsPrincipalPage } from '../usr_tabs-principal/tabs-principal';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';

@IonicPage()
@Component({
  selector: 'page-bloquear-cartao',
  templateUrl: 'bloquear-cartao.html',
})
export class BloquearCartaoPage implements OnInit {

  @ViewChild(IonDigitKeyboardCmp) keyboard;

  passwordCard: string = '';
  cardNumber: string = '';
  objSend: object;
  cards: object;
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
  
  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public http: Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public storage: Storage, public plt: Platform, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics, public popoverCtrl: PopoverController){
    this.g = new Global();
    this.cardNumber = this.navParams.get('cardNumber');
    this.title = this.navParams.get('title');
	
    //botoes    
    this.btnEntrar = null;
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    });
    
	  this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });
	
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
  


  lockUnlockCard(){
  	this.objSend = {
  		procedimento: 40,
  		p_numero_cartao: this.cardNumber,
  		p_senha_cartao: this.passwordCard
  	}
  	this.apiLockUnlokckCard(this.g.urlApi, this.objSend);
  }

  //requisicoes
  apiLockUnlokckCard(url, arraySend){
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        if(data.message == 'Sucesso'){
	        if(data.result[0]['r_msg_titulo'] == 'Sucesso'){
            this.toast(data.result[0]['r_msg'], '3000', 'top', 'success');                                   
            setTimeout(() => {   
              this.navCtrl.popAll().then(() => {
                this.app.getRootNav().setRoot(TabsPrincipalPage);
              });               
            }, 2000);
	        }else{
	        	this.passwordCard = '';
	        	this.toast(data.result[0]['r_msg'], '3000', 'top', 'error');
	        }
        }else{
          this.passwordCard = '';
          this.toast('Senha incorreta ou inválida', '3500', 'top', 'error');
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
        if (key == 'right') this.lockUnlockCard();  
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
}