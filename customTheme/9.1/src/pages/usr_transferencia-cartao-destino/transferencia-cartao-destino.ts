import { Component, ViewChild, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { TransferenciaValorPage } from '../usr_transferencia-valor/transferencia-valor';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';


/**
 * Generated class for the TransferenciaCartaoDestinoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-transferencia-cartao-destino',
	templateUrl: 'transferencia-cartao-destino.html',
})
export class TransferenciaCartaoDestinoPage implements OnInit {

	@ViewChild(IonDigitKeyboardCmp) keyboard;

	g: any;
	load: any;
  saveCard: boolean;
	idEmpresa: any;
	titlePage: string;
	focus: string = '';
	cardNumber: string = '';
  fromCard: string = "";
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

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public translateService: TranslateService, public storage: Storage, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics) {
		this.g = new Global();
    //segment
    //botoes
    this.saveCard = true;
    this.fromCard = navParams.get('fromCard');


    //titulo da pagina
    this.translateService.get('PG_TRANSFERENCIA-TITULO_CARTAO_DESTINO').subscribe((value) => {
      this.titlePage = value;
    });
	  this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    });
    //foco campo inicial
    this.focus = 'cardNumber';

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA).then(() => {
        this.ga.trackView(this.company + '/' + this.titlePage);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });
	}

  goToTransferValue(cardNumber){
    //this.vibration.vibrate(50);
    this.navCtrl.push(TransferenciaValorPage, {
      fromCard: this.g.removeDotSpace(this.fromCard),
      toCard: cardNumber
    });
  }

  //validar cartao
  cardValidator(){
    let userData = {
      procedimento: 34,
      p_numero_cartao: this.g.removeSpace(this.cardNumber),
      p_token: null,
      p_plataforma: null,
      p_numero_celular: null,
      p_operadora: null
    }

    this.apiCardValidator(this.g.urlApi, userData);
  }
  // refatorar
  apiCardValidator(url, arraySend){
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        if(data.message == 'Sucesso' && data.result[0]['r_tipo_cartao'] == 'CONVENIENCE CARD'){
          this.goToTransferValue(JSON.parse(body)['p_numero_cartao']);
        }else{
          this.keyboard.show();
          this.clear();
          this.focus ='cardNumber';
          this.toast('Cartão não autorizado para essa transação', '2500', 'top', 'error');
        }
      },
      err => { this.load.dismiss(); this.keyboard.show(); this.focus ='cardNumber'; this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => this.load.dismiss()
    );
  }

	//mascaras
  maskCard(){
    let newCard = this.cardNumber;
    newCard = newCard.split(" ").join("");
    if(newCard.length < 16){
      if (newCard.length > 0) {
        newCard = newCard.match(new RegExp('.{1,4}', 'g')).join(" ");
      }
    }else{
      newCard = [newCard.slice(0, 6), ' ', newCard.slice(6)].join('');
      newCard = [newCard.slice(0, 11), ' ', newCard.slice(11)].join('');
      newCard = [newCard.slice(0, 16), ' ', newCard.slice(16)].join('');
    }
    if (newCard.length > 20){
      newCard = newCard.slice(0, -1);
    }
    this.cardNumber = newCard;
  }

	clear(){
    //this.vibration.vibrate(50);
    this.cardNumber = '';
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

  //Keyboard
  ngOnInit(): void {
    this.keyboard.onClick.subscribe((key: any) => {
      let field = this.focus;
      //this.vibration.vibrate(50);
      if (typeof key == 'number') {
        this.maskCard();
        this[field] += key;
      } else {
        if (key == 'left') this[field] = this[field].substring(0, this[field].length - 1);
        if (key == 'right'){
          if(field == 'cardNumber'){
            this.cardValidator();
          }
        }
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
}
