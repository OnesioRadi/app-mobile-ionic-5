import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform} from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Display } from '../../display/display';
import { HomePage } from '../home/home';
import { SaldoCartaoPage } from '../rcd_saldo-cartao/saldo-cartao';
import { ConfiguracoesRedePage } from '../rcd_configuracoes-rede/configuracoes-rede';
import { VendaCartaoPage } from '../rcd_venda-cartao/venda-cartao';
import { Http } from '@angular/http';
import { RecargaCartaoPage } from '../rcd_recarga-cartao/recarga-cartao';
import { ExtratoVendaPage } from '../rcd_extrato-venda/extrato-venda';

@IonicPage()
@Component({
  selector: 'page-menu-principal',
  templateUrl: 'menu-principal.html',
})

export class MenuPrincipalPage {
  rootPage:any = HomePage;
  g: any;
  d: Object;
  load: any;
  company: number;
  titlePage: string;
  merchantName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public translateService: TranslateService, private alertCtrl: AlertController, public loadingCtrl: LoadingController, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics, ){
    this.g = new Global();
    this.d = new Display();

    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })    
    this.translateService.get('PG_MENU-PRINCIPAL_TITULO').subscribe((value) => {
      this.titlePage = value;
    })

    this.merchantName = localStorage.getItem('merchantName');

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA)
      .then(() => {
      this.ga.trackView(this.company + '/' + this.titlePage);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });
  }

  goToSale(){
    this.navCtrl.push(VendaCartaoPage, {
      pageCount: 1
    });
  }
  
  goToBalanceCard(){
    this.navCtrl.push(SaldoCartaoPage);
  }

  goToConf(){
    this.navCtrl.push(ConfiguracoesRedePage);
  }

  goToCardRecharge(){
    this.navCtrl.push(RecargaCartaoPage, {
      pageCount: 1
    });
  }

  goToSaleExtract(){
    alert('teste');


    this.navCtrl.push(ExtratoVendaPage);  
  }

  exit(){
    let alert = this.alertCtrl.create({
      title: 'Deseja sair?',
      message: 'Você será redirecionado para o menu principal',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
    
  }

  loading(title){
    this.load = this.loadingCtrl.create({
      content: '<h5>'+title+'</h5>'
    });
    this.load.present();
  }
}
