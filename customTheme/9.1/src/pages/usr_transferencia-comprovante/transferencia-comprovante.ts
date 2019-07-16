import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { DetalheCartaoPage } from '../usr_detalhe-cartao/detalhe-cartao';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-transferencia-comprovante',
  templateUrl: 'transferencia-comprovante.html',
})
export class TransferenciaComprovantePage {
  public rootPage: any = DetalheCartaoPage;
  load: any;
  g: any;
  card: object;
  company: string;
  pageTitle: string;
  ticketTop: string;
  ticketBottom: string;
  agree: boolean;
  degree: boolean;
  respCod: string;
  respMsg: string;
  situationIcon: string;
  situation: string;


  constructor(public navCtrl: NavController, public plt: Platform, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, public storage: Storage, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics) {
    this.g = new Global();
    //received parameters
    this.respCod = navParams.get('respCod');
    this.respMsg = navParams.get('respMsg');
    this.card = navParams.get('dataCard');

    //local variables
    this.ticketTop = "../../assets/img/fundos/topo-cupom.svg";
    this.ticketBottom = "../../assets/img/fundos/base-cupom.svg";
    this.agree = true;
    this.degree = true;


    //titulo da pagina
    this.translateService.get('PG_TRANSFERENCIA-TITULO_COMPROVANTE').subscribe((value) => {
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

    this.situationVerify();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferenciaComprovantePage');
  }

  situationVerify(){
    if ( this.respCod == '00' ){
      this.situationIcon = "../../assets/img/icones/aprovada.svg";
      this.situation = "aprovada";
      this.agree = false;
      console.log(this.situationIcon);
    }else{
      this.situationIcon = "../../assets/img/icones/reprovada.svg";
      this.situation = "reprovada";
      this.degree = false;
    }
  }

  closeTicket(){
    this.navCtrl.pop();
    this.navCtrl.pop();
    this.navCtrl.pop();
    this.navCtrl.pop();
  }
}
