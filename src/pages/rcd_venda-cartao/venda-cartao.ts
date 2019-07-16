import { Component, ViewChild, OnInit} from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http } from '@angular/http';
import { VendaValorPage } from '../rcd_venda-valor/venda-valor';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';

/**
 * Generated class for the VendaCartaoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-venda-cartao',
  templateUrl: 'venda-cartao.html',
})
export class VendaCartaoPage implements OnInit {

  @ViewChild(IonDigitKeyboardCmp) keyboard;

  g: any;
  load: any;
  idEmpresa: any;
  pageTitle: string;
  focus: string = '';
  cardNumber: string = '';
  balance: any;
  company: string;
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
    
    this.pageCount = navParams.get("pageCount");
    
    //titulo da pagina
    this.translateService.get('PR_REDE-CREDENCIADA-PG-CARTAO_TITULO').subscribe((value) => {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendaCartaoPage');
  }

  cardValidator(){
    this.apiCardValidator(this.g.urlPos, this.g.removeSpace(this.cardNumber));
  }

  apiCardValidator(url, cardNumber){
    let newUrl = url + '/validacartao?2=' + cardNumber;
    this.http.get(newUrl)
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        let arr = Object.keys(data).map(function(k) { return data[k] });
        if(arr[0][62] == 'OK'){
          let cardResponse = arr[0][63.1];
          let passwordRequired = cardResponse.substr(0,1);
          let partMax = cardResponse.substr(1,2);
          let product = cardResponse.substr(3,2);
          let productGroup = cardResponse.substr(5,1);
          let productCod = cardResponse.substr(6,1);
          let productQtd = cardResponse.substr(7,1);
          let productValue = cardResponse.substr(8,1);
          let vehiclePlate = cardResponse.substr(9,1);
          let vehicleKm = cardResponse.substr(10,1);
          let driverReg = cardResponse.substr(11,1);

          this.navCtrl.push(VendaValorPage, {
            pageCount: this.pageCount + 1,
            cardNumber: this.cardNumber,
            passwordRequired: passwordRequired,
            partMax: partMax,
            product: product,
            productGroup: productGroup,
            productCod: productCod,
            productQtd: productQtd,
            productValue: productValue,
            vehiclePlate: vehiclePlate,
            vehicleKm: vehicleKm,
            driverReg: driverReg
         });
        }else{
          this.keyboard.show();
          this.focus ='cardNumber';
          this.toast(arr[0][62], '2500', 'top', 'error');
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

  //alertCtrl
  balanceAlert(balance) {
    const alert = this.alertCtrl.create({
      title: 'Saldo do Cartão',
      message: 'Saldo R$ ' + balance.toFixed(2),
      buttons: ['OK']
    });
    alert.present();
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