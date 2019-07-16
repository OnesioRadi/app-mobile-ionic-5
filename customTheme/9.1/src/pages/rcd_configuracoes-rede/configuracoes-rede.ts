import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController} from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-configuracoes-rede',
  templateUrl: 'configuracoes-rede.html',
})

export class ConfiguracoesRedePage {
   g: any;
   company: number;
   titlePage: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public translateService: TranslateService, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics){
    this.g = new Global();

    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
    this.translateService.get('PG_CONFIGURACOES-REDE_TITULO').subscribe((value) => {
      this.titlePage = value;
    })

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA)
      .then(() => {
      this.ga.trackView(this.company + '/' + this.titlePage);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
      });
  }

  settingsCleaningConfirm(){
    let confirm = this.alertCtrl.create({
       title: 'Deseja limpar as configurações?',
       message: 'Essa opção irá remover seus dados armazenados como CNPJ e NEU',
       buttons: [
         {
           text: 'Não',
           handler: () => {}
         },
         {
           text: 'Sim',
           handler: () => {             
             this.settingCleaning();
           }
         }
       ]
     });          
     confirm.present();
   }
 
   settingCleaning()
   {
     localStorage.clear();
     this.navCtrl.popToRoot();
   }

}
