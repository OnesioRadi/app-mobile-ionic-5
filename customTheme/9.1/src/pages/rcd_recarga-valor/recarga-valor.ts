import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http } from '@angular/http';
import { Utils } from "../../app/utils";
import { ComprovantePage } from '../rcd_comprovante/comprovante';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';

@IonicPage()
@Component({
  selector: 'page-recarga-valor',
  templateUrl: 'recarga-valor.html',
})
export class RecargaValorPage {
  @ViewChild(IonDigitKeyboardCmp) keyboard;

	g: any;
	load: any;
  saveCard: boolean;
	idEmpresa: any;
	titlePage: string;
	focus: string = '';
  company: string;

  neu: string;
  cardNumber: string = '';
  formatCard: string;
  userName: string;
  rechargeValue: string = '0,00';
  rechargeConfirm: boolean;
  keyboardVirtual: boolean;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, private alertCtrl: AlertController, public translateService: TranslateService, public storage: Storage, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics, private utils: Utils) {
  	this.g = new Global();
 
    this.cardNumber = navParams.get('cardNumber');
    this.userName = navParams.get('userName');
    this.pageCount = navParams.get('pageCount');
 		//localstorage
    this.neu = localStorage.getItem('rcNeu');

		//exibicao
		this.rechargeConfirm = true;
		this.keyboardVirtual = false;
    
    //titulo da pagina
    this.translateService.get('PR_REDE-CREDENCIADA-PG-RECARGA-VALOR').subscribe((value) => {
      this.titlePage = value;
    });
	  this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    })
    //foco campo inicial
    this.focus = 'rechargeValue';

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA).then(() => {
        this.ga.trackView(this.company + '/' + this.titlePage);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });
  }

  amountChange() {
    this.rechargeValue = this.utils.detectAmount(this.rechargeValue);
  }

  rechargeValueConfirm(){
		//exibicao
		this.rechargeConfirm = false;
		this.keyboardVirtual = true;
  }

  rechargeMake(){		 		
		this.loading('Efetuando...');
				
		let url = 'http://ws.orgcard.com.br:31000/iso/1/0200?2='+this.cardNumber+'&3=930000&4='+this.rechargeValue+'&42='+this.neu+'&52=';   
    		
		this.http.get(url)
			.map(res => res.json())
			.subscribe(
        data =>{
			 	
					let arr = Object.keys(data).map(function(k) { return data[k] })
          
          let respCod = arr['0']['39'];
          let respMsg = arr['0']['62'];
          let authCode = null;
          let printCoupon = null;
          let mailCoupon = null;
          let smsCoupon = null;
								
          //verifica se os parâmetros existem          
          if(typeof(arr['0']['38']) != 'undefined') {   
            authCode = (arr['0']['38']);
            printCoupon = (arr['0']['63.3']);
            mailCoupon = (arr['0']['63.3']);
            smsCoupon = (arr['0']['63.3']);
          }          

					this.navCtrl.push(ComprovantePage, {
            pageCount: this.pageCount + 1,
						respCod: respCod,
						respMsg: respMsg,
						authCode: authCode,
						printCoupon: printCoupon,
						mailCoupon: mailCoupon,
						smsCoupon: smsCoupon
					});  					
				},    
				err => { console.log(err); this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); },
				() => this.load.dismiss()
			);
	}
  
  cancel(){   
		let confirm = this.alertCtrl.create({
			title: 'Gostaria de cancelar a transação?',
			message: 'Se sim, você será redirecionado ao menu principal',
			buttons: [
				{
					text: 'Não',
					handler: () => {}
				},
				{
					text: 'Sim',
					handler: () => {						
						this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));
					}
				}
			]
		});
		confirm.present();
	}

  clear(){
    //this.vibration.vibrate(50);
    this.rechargeValue = "";
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
        this[field] += key;
      } else {
        if (key == 'left') this[field] = this[field].substring(0, this[field].length - 1);
        if (key == 'right'){
          if(field == 'rechargeValue'){
            this.rechargeValueConfirm();
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