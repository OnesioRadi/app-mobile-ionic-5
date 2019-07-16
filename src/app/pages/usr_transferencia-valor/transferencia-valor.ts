import { Component, ViewChild, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TransferenciaSenhaPage } from '../usr_transferencia-senha/transferencia-senha';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';
import { Utils } from "../../../app/utils";

@IonicPage()
@Component({
  selector: 'page-transferencia-valor',
  templateUrl: 'transferencia-valor.html',
})

export class TransferenciaValorPage implements OnInit {
	@ViewChild(IonDigitKeyboardCmp) keyboard;

	g: any;
	load: any;
  saveCard: boolean;
	idEmpresa: any;
	titlePage: string;
	focus: string = '';
	transferValue: string = '';
  fromCard: string = "";
  toCard: string = "";
	company: string;

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public translateService: TranslateService, public storage: Storage, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics, private utils: Utils) {
  	this.g = new Global();

    this.fromCard = navParams.get('fromCard');
    this.toCard = navParams.get('toCard');

    //titulo da pagina
    this.translateService.get('PG_TRANSFERENCIA-TITULO_VALOR').subscribe((value) => {
      this.titlePage = value;
    });
	  this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    })
    //foco campo inicial
    this.focus = 'transferValue';

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA).then(() => {
        this.ga.trackView(this.company + '/' + this.titlePage);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });
  }

  amountChange() {
    this.transferValue = this.utils.detectAmount(this.transferValue);
  }

  clear(){
    //this.vibration.vibrate(50);
    this.transferValue = "";
  }

  //loading
  loading(title){
    this.load = this.loadingCtrl.create({
      content: '<h5>'+title+'</h5>',
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

  goToTransferPass(){
      //this.vibration.vibrate(50);
      this.navCtrl.push(TransferenciaSenhaPage, {
        fromCard: this.fromCard,
        toCard: this.toCard,
        transferValue: this.transferValue.replace(',', '')
      });
  }

  //Keyboard
  ngOnInit(): void {
    this.keyboard.onClick.subscribe((key: any) => {
      let field = this.focus;
      //this.vibration.vibrate(50);
      if (typeof key == 'number') {
        this[field] += key;
      } else {
        if (key == 'left') this[field] = this[field].substring(0, this[field].length - 1);
        if (key == 'right'){
          if(field == 'transferValue'){
            this.goToTransferPass();
          }
        }
      }
      this.amountChange();
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

}
