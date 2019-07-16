import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-extrato-venda-detalhe',
  templateUrl: 'extrato-venda-detalhe.html',
})
export class ExtratoVendaDetalhePage {
  g: any;
  load: any;
  company: number;
  idCompany: number;
  titlePage: string;
  extractItem: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public translateService: TranslateService, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics, ){
    this.g = new Global();

    this.extractItem = [];
    this.extractItem = navParams.get("extractItem");
    
    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });

    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idCompany = value;
    });

    this.translateService.get('PR_REDE-CREDENCIADA-PG-EXTRATO-VENDAS-DET-TITULO').subscribe((value) => {
      this.titlePage = value;
    });

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA)
      .then(() => {
      this.ga.trackView(this.company + '/' + this.titlePage);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });   
  }
}
