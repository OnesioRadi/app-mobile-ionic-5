import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Global } from '../../global/global';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Vibration } from '@ionic-native/vibration';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage {
	
  g:any;
  idEmpresa: any;
  company: string;
  title: string;
   
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public plt: Platform, private ga: GoogleAnalytics, public translateService: TranslateService, public vibration: Vibration) {
	this.g = new Global();
	
	this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    })
	this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
	this.translateService.get('PG_CONFIGURACOES_TITULO').subscribe((value) => {
      this.title = value;
    })
	
	plt.ready().then(() => { 
      /*Google Analytics*/
	  this.ga.startTrackerWithId(this.g.codeGA)
	  .then(() => {
		this.ga.trackView(this.company + '/' + this.title);
	  })
	  .catch(e => console.log('Erro ao iniciar Google Analytics', e));	  
    });
  }
}
