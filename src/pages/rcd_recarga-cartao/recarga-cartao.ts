import { Component, ViewChild } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';
import { RecargaValorPage } from '../rcd_recarga-valor/recarga-valor';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-recarga-cartao',
  templateUrl: 'recarga-cartao.html',
})
export class RecargaCartaoPage {
  @ViewChild(IonDigitKeyboardCmp) keyboard;

  g: any;
  load: any;
  idEmpresa: any;
  pageTitle: string;
  focus: string = '';
  balance: any;
  company: string;

  cardNumber: string = '';
  formatedCard: string;
  userName: string;
  endPoint: string = '';
  pageCount: number;

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public translateService: TranslateService, public storage: Storage, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics) {
    this.g = new Global();

    this.endPoint = this.g.UrlAPi;
    this.pageCount = this.navParams.get('pageCount');
    
    //titulo da pagina
    this.translateService.get('PR_REDE-CREDENCIADA-PG-RECARGA-CARTAO-TITULO').subscribe((value) => {
      this.pageTitle = value;
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
        this.ga.trackView(this.company + '/' + this.pageTitle);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });
  }

  consomeCardValidator(){    
    this.cardValidator(34, this.g.removeSpace(this.cardNumber), null, null, null, null);
  }

  cardValidator(procedimento, numero_cartao, token, plataforma, numeroCelular, operadora){
		//carregando
		this.loading('Verificando...');

		let body = JSON.stringify({procedimento: procedimento, p_numero_cartao: numero_cartao, p_token: token, p_plataforma: plataforma, p_numero_celular: numeroCelular, p_operadora: operadora});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });     

		this.http.post(this.g.urlApi, body, options)
			.map(res => res.json())
			.subscribe(
				data =>{
					//verifica retorno da api
					if(data.message == 'Sucesso'){						 
						this.userName = data.result[0]['r_nome_cartao'];
            this.cardNumber = data.result[0]['r_numero_cartao'];
            
						this.navCtrl.push(RecargaValorPage, { 
              pageCount: this.pageCount + 1,                       
							userName: this.userName,
							cardNumber: this.cardNumber,
							formatedCard: this.formatedCard 
						});

					}else{
            this.toast('Cartão inválido', '1500', 'top', 'notice');					
					}
				},  
			err => { console.log(err); this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); },
			() =>this.load.dismiss()
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
            this.consomeCardValidator();            
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
