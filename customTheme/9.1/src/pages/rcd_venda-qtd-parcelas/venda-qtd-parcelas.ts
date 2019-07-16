import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http } from '@angular/http';
import { VendaSenhaPage } from '../rcd_venda-senha/venda-senha';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';
import { Utils } from "../../app/utils";

@IonicPage()
@Component({
  selector: 'page-venda-qtd-parcelas',
  templateUrl: 'venda-qtd-parcelas.html',
})
export class VendaQtdParcelasPage {
  @ViewChild(IonDigitKeyboardCmp) keyboard;

  g: any;
	load: any;
  saveCard: boolean;
	idEmpresa: any;
	titlePage: string;
	focus: string = '';
  company: string;
  cardNumber:string;
  passwordRequired:string;
  partMax: number;
  product:string;
  productGroup:string;
  productCod:string;
  productQtd:string;
  productValue:string;
  vehiclePlate:string;
  vehicleKm:string;
  driverReg:string;
  saleValue: string;
  partQtd: string = '0';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public translateService: TranslateService, public storage: Storage, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics, private utils: Utils) {
    this.g = new Global();

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
    this.saleValue = navParams.get("saleValue");
    this.pageCount = navParams.get("pageCount");

    //titulo da pagina
    this.translateService.get('PR_REDE-CREDENCIADA-PG-CARTAO_VALOR').subscribe((value) => {
      this.titlePage = value;
    });
    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    })
    //foco campo inicial
    this.focus = 'partQtd';

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA).then(() => {
        this.ga.trackView(this.company + '/' + this.titlePage);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });
  }

  padPartQtd(){
    this.partQtd = this.utils.paddingValue(parseInt(this.partQtd, 10), 2);        
    console.log(this.partQtd); 
  }

  partQtdValidades(){

    // Limita em 16 parcelas
    this.partMax = 30;

    if(parseInt(this.partQtd, 10) > this.partMax){
      //this.toast('O máximo de parcelas são:' + this.partMax, 1500, 'top', 'error');
      this.toast('Número de parcela não permitido.', 1500, 'top', 'error');
    }else{
      this.goToSalePasswrod();
    }
  }

  goToSalePasswrod(){
    console.log(parseInt(this.partQtd, 10));
    this.navCtrl.push(VendaSenhaPage, {
      pageCount: this.pageCount + 1,
      cardNumber: this.cardNumber,
      passwordRequired: this.passwordRequired,
      partMax: this.partMax,
      product: this.product,
      productGroup: this.productGroup,
      productCod: this.productCod,
      productQtd: this.productQtd,
      productValue: this.productValue,
      vehiclePlate: this.vehiclePlate,
      vehicleKm: this.vehicleKm,
      driverReg: this.driverReg,
      saleValue: this.saleValue,
      partNumber: parseInt(this.partQtd, 10)
    });
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
          if(field == 'partQtd'){
            this.partQtdValidades();
          }
        }
      }
      this.padPartQtd();
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