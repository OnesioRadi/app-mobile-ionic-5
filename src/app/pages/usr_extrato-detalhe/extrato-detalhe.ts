import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Global } from '../../global/global';
import { Display } from '../../display/display';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

/**
 * Generated class for the ExtratoDetalhePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-extrato-detalhe',
  templateUrl: 'extrato-detalhe.html',
})
export class ExtratoDetalhePage {
  openStatement: object;
  d: object;  
  g: any;
  company: string;
  titlePage: string;
  saleDetail: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public translateService: TranslateService, private ga: GoogleAnalytics) {
    //constantes
    this.g = new Global();
    this.d = new Display();

    this.saleDetail = navParams.get('detail');
    if(this.saleDetail.valor < 0 ){
      this.saleDetail.valor *= -1; 
    }
    console.log(this.saleDetail);
       
    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
        this.company = value;
    });
    this.translateService.get('PG_DETALHE-CARTAO_TITULO').subscribe((value) => {
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