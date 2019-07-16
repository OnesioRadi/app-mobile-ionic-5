import { Component, ViewChild, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { ComprovantePage } from '../rcd_comprovante/comprovante';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';
import { Utils } from "../../app/utils";

@IonicPage()
@Component({
  selector: 'page-venda-senha',
  templateUrl: 'venda-senha.html',
})
export class VendaSenhaPage implements OnInit {

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
  pageTitle: string;

  cardNumber: string;
  passwordRequired:string;
  partMax: number;
  product: string;
  productGroup: string;
  productCod: string;
  productQtd: string;
  productValue: string;
  vehiclePlate: string;
  vehicleKm: string;
  driverReg: string;
  partNumber: number;
  saleValue: string;
  showValue: string;
  neu: string;
  saleValueConfirm: number;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public storage: Storage, public plt: Platform, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics, private utils: Utils){
    this.g = new Global();
    //botoes
    this.btnEntrar = null;

    //parameters
    this.cardNumber = navParams.get("cardNumber");
    this.passwordRequired = navParams.get("passwordRequired");
    this.partMax = navParams.get("partMax");
    this.product = navParams.get("product");
    this.productGroup = navParams.get("productGroup");
    this.productCod = navParams.get("productCod");
    this.productQtd = navParams.get("productQtd");
    this.productValue = navParams.get("productValue");
    this.vehiclePlate = navParams.get("vehiclePlate");
    this.vehicleKm = navParams.get("vehicleKm");
    this.driverReg = navParams.get("driverReg");
    this.partNumber = navParams.get("partNumber");
    this.saleValue = navParams.get("saleValue");
    this.neu = localStorage.getItem("rcNeu");
    this.pageCount = navParams.get("pageCount");

    console.log(this.partNumber);
    this.showValue = this.utils.detectAmount(this.saleValue);
    this.saleValueConfirm = parseInt(this.removeCharacters(this.saleValue));    

    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    });
    this.translateService.get('CG_TIPO_SENHA_LOGIN').subscribe((value) => {
      this.typePassword = value;
    });

	  this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });
	  this.translateService.get('PR_REDE-CREDENCIADA-PG-CARTAO_CONFIMAR_VALOR').subscribe((value) => {
      this.pageTitle = value;
    });

	  plt.ready().then(() => {
      /*Google Analytics*/
	    this.ga.startTrackerWithId(this.g.codeGA)
	    .then(() => {
		  this.ga.trackView(this.company + '/' + this.pageTitle);
	    })
	    .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });

	  //foco campo inicial
    this.focus ='passwordCard';
  }

  goToTicket(respCod, respMsg, authCode, printCoupon, mailCoupon, smsCoupon){
    this.navCtrl.push(ComprovantePage, {   
      pageCount: this.pageCount + 1,       
      respCod: respCod,
      respMsg: respMsg,
      authCode: authCode,
      printCoupon: printCoupon,
      mailCoupon: mailCoupon,
      smsCoupon: smsCoupon
    });  
  }
  
  //submit o form
  saleRegister(){
    this.apiSaleRegister(this.g.urlPos, this.g.removeSpace(this.cardNumber), this.saleValueConfirm, this.neu, this.passwordCard, this.vehiclePlate, this.vehicleKm, 
                         this.product, this.productQtd, this.productValue, this.driverReg, this.partNumber );
  }

  apiSaleRegister(url, cardNumber, saleValueConfirm, neu, passwordCard, vehiclePlate, vehicleKm, product, productQtd, productValue, driverReg, partNumber){
    
    let newUrl = url + '/validatransacao?2=' + cardNumber + '&4='+ saleValueConfirm +'&42='+ neu + '&52='+ passwordCard + '&60.11='+ vehiclePlate +'&60.12='+ vehicleKm +
                       '&60.221='+ product +'&60.231='+ productQtd +'&60.241='+ productValue +'&60.31='+ driverReg +'&67='+ partNumber;
    console.log(newUrl);
    this.http.get(newUrl)
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{       
        let arr = Object.keys(data).map(function(k) { return data[k] });
        
        let respCod = arr['0']['39'];
        let respMsg = arr['0']['62'];
        let authCode = null;
        let printCoupon = null;
        let mailCoupon = null;
        let smsCoupon = null;
       
        //verifica se os parâmetros existem          
        if(typeof(arr['0']['38']) != 'undefined') {   
          authCode = (arr['0']['38']);
          printCoupon = (arr['0']['63']['1']);
          mailCoupon = (arr['0']['63']['2']);
          smsCoupon = (arr['0']['63']['3']);
        }

        console.log(respCod);
        console.log(respMsg);
        console.log(authCode);
        console.log(printCoupon);
        console.log(mailCoupon);
        console.log(smsCoupon); 

        this.goToTicket(respCod, respMsg, authCode, printCoupon, mailCoupon, smsCoupon);
      },
      err => { this.load.dismiss(); this.keyboard.show(); this.focus ='passwordCard'; this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => this.load.dismiss()
    );
  }

  removeCharacters(value){
    return value.replace(/,/g, "");
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
        if (key == 'right') this.saleRegister();
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
