import { Component, ViewChild, enableProdMode } from '@angular/core'; //Habilitar em produção
//import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HeaderColor } from '@ionic-native/header-color';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { ContatoPage } from '../pages/contato/contato';
enableProdMode(); //habilitar em produção

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = HomePage;
  color: string;
  pages: Array<{title: string, iconName: string, component: any}>;
  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private translateService: TranslateService, private headerColor: HeaderColor, private alertCtrl: AlertController, public storage: Storage){

    platform.ready().then(() => {
      this.translateService.get('CG_COR').subscribe((value) => {
        this.color = value;
      });
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString(this.color);
      this.headerColor.tint(this.color);
    });
    this.pages = [
      { title: 'Contato', iconName: 'mail', component: ContatoPage },
      { title: 'Limpar configurações', iconName: 'trash', component: HomePage },
      { title: 'Sair', iconName: 'log-out', component: HomePage }

    ];
    this.initTranslate();
  }
  ionViewDidLoad(){
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }
  initTranslate() {
	this.translateService.setDefaultLang('labels');
  }
  openPage(page) {
    if(page.title == 'Limpar configurações'){
      this.clearLocalData();
    }else if(page.title == 'Sair'){
      this.exit();
    }else{
      this.nav.push(page.component);
    }
  }
  clearLocalData(){
    let alert = this.alertCtrl.create({
      title: 'Deseja limpar as configurações?',
      message: 'Essa opção irá remove seus dados salvos no aplicativo',
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
            this.storage.remove('saveCard');
            this.storage.remove('saveCpf');
            this.storage.remove('userData');
            this.nav.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
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
          this.nav.setRoot(HomePage);
        }
      }
    ]
  });
  alert.present();
 }
 getUrlVars(){
    let vars = [],
    hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

}
