import { Component, ViewChild, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { TransferenciaComprovantePage } from '../usr_transferencia-comprovante/transferencia-comprovante';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';

@IonicPage()
@Component({
  selector: 'page-transferencia-senha',
  templateUrl: 'transferencia-senha.html',
})
export class TransferenciaSenhaPage implements OnInit {

  @ViewChild(IonDigitKeyboardCmp) keyboard;

  passwordCard: string = '';
  objSend: object;
  g: any;
  load: any;
  btnEntrar: any;
  idEmpresa:any;
  typePassword:any;
  focus: string = '';
  transferValue: string = '';
  fromCard: string = "";
  toCard: string = "";
  company: string;
  titlePage: string;

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

    //parameters
    this.fromCard = navParams.get('fromCard');
    this.toCard = navParams.get('toCard');
    this.transferValue = navParams.get('transferValue');

    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    });
    this.translateService.get('CG_TIPO_SENHA_LOGIN').subscribe((value) => {
      this.typePassword = value;
    });

	  this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });
	  this.translateService.get('PG_TRANSFERENCIA-TITULO_SENHA').subscribe((value) => {
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

	  //foco campo inicial
    this.focus ='passwordCard';
  }

  goToTicket(respCod, respMsg){
    this.navCtrl.push(TransferenciaComprovantePage, {
      respCod: respCod,
      respMsg: respMsg
    });
  }

  //submit o form
  transferRegister(){
    this.apiTransferRegister(this.g.urlPos, this.g.removeSpace(this.fromCard), this.g.removeSpace(this.toCard), this.transferValue);
  }

  apiTransferRegister(url, fromCard, toCard, transferValue){
    let newUrl = url + '/transferencia?2=606443020102915573' + /*this.fromCard + */'&3=960000&22=011&4='+ this.transferValue + '&52=' + this.passwordCard + '&60='+this.toCard;
    console.log(newUrl);
    this.http.get(newUrl)
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        let arr = Object.keys(data).map(function(k) { return data[k] });
        this.goToTicket(arr[0][39], arr[0][62]);
      },
      err => { this.load.dismiss(); this.keyboard.show(); this.focus ='passwordCard'; this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
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
        if (key == 'right') this.transferRegister();
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
