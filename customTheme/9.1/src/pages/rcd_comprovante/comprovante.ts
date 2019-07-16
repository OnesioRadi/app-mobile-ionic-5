import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { Http } from '@angular/http';
import { EnviarComprovantePage } from '../rcd_enviar-comprovante/enviar-comprovante';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-comprovante',
  templateUrl: 'comprovante.html',
})
export class ComprovantePage {
  load: any;
  g: any;
  card: object;
  company: string;
  pageTitle: string;
  ticketTop: string;
  ticketBottom: string;
  agree: boolean;
  degree: boolean;
  situationIcon: string;
  situation: string;
  respCod: string;
  respMsg: string;
  authCode: string;
  printCoupon: string;
  mailCoupon: string;
  smsCoupon: string;
  pageCount: number;

  constructor(public navCtrl: NavController, public plt: Platform, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, public storage: Storage, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics) {
    this.g = new Global();

    //Constants
    this.ticketTop ="../assets/img/fundos/topo-cupom.svg";
    this.ticketBottom ="../assets/img/fundos/base-cupom.svg";
    this.agree = true;
    this.degree = true;

    //parametros recebidos 
    this.respCod = navParams.get("respCod");
    this.respMsg = navParams.get("respMsg");
    this.authCode = navParams.get("authCode");
    this.printCoupon = navParams.get("printCoupon");
    this.mailCoupon = navParams.get("mailCoupon");
    this.smsCoupon = navParams.get("smsCoupon");
    this.pageCount = navParams.get("pageCount");

    this.situationValidates();

    //decode
    //this.comprovanteImpressa = decodeURI(this.comprovanteImpressa);
    this.mailCoupon = decodeURI(this.mailCoupon);
    this.smsCoupon = decodeURI(this.smsCoupon);

    //titulo da pagina
    this.translateService.get('PR_REDE_CREDENCIADA-PG-COMPROVANTE').subscribe((value) => {
      this.pageTitle = value;
    });
    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA).then(() => {
        this.ga.trackView(this.company + '/' + this.pageTitle);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });
  }

  mailSend(){
    this.navCtrl.push(EnviarComprovantePage, {
      pageCount: this.pageCount + 1,
      emailCoupon: this.mailCoupon,
      smsCoupon: this.smsCoupon  
    });
  }

  close(){
    this.pageCount++;
    this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-this.pageCount));
  }

  situationValidates(){    
    if(this.respCod == '00'){
        console.log('Opa');
        this.situationIcon ="assets/img/icones/aprovada.svg";
        this.situation = "aprovada";
        this.agree = false;  
    }else{
        this.situationIcon ="assets/img/icones/reprovada.svg";
        this.situation = "reprovada";
        this.degree = false;
    }
  }
}
