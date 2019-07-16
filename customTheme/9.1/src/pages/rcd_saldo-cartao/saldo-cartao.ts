import { Component, ViewChild, OnInit} from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';

@IonicPage()
@Component({
  selector: 'page-saldo-cartao',
  templateUrl: 'saldo-cartao.html',
})
export class SaldoCartaoPage implements OnInit {

  @ViewChild(IonDigitKeyboardCmp) keyboard;

  g: any;
  load: any;
  idEmpresa: any;
  pageTitle: string;
  focus: string = '';
  cardNumber: string = '';
  balance: any;
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


  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public translateService: TranslateService, public storage: Storage, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics) {
    this.g = new Global();

    //titulo da pagina
    this.translateService.get('PR_REDE-CREDENCIADA-SALDO-CARTAO_TITULO').subscribe((value) => {
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
    console.log('ionViewDidLoad SaldoCartaoPage');
  }

  //submit o form
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
          this.loadBalance(cardNumber);

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

//Consultar saldo do usuário

  loadBalance(cardNumber){
    let userData = {
      procedimento: 52,
      p_numero_cartao:this.cardNumber
    }
    this.apiBalance(this.g.urlApi, userData);
  }

    //requisicoes
  apiBalance(url, arraySend){
    let body = JSON.stringify(arraySend);
    console.log(JSON.parse(body)['p_numero_cartao']);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
    .map(res => res.json())
      .subscribe(
      data =>{
        if(data.message == 'Sucesso'){
          this.balanceAlert(data.result[0]['saldo_disponivel']);
        }else{
          this.toast('Não foi possível carregar o saldo do cartão', '3500', 'top', 'error');
        }
      },
      err => { this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
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
