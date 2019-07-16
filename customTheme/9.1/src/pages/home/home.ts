	import { Component } from '@angular/core';
	import { IonicPage, NavController, Platform } from 'ionic-angular';
	import { Storage } from '@ionic/storage';
	import { Vibration } from '@ionic-native/vibration';
	import { Global } from '../../global/global';
	import { TranslateService } from '@ngx-translate/core';
	import { GoogleAnalytics } from '@ionic-native/google-analytics';
	import { Display } from '../../display/display';
	import { CadastrarCartaoPage } from '../usr_cadastrar-cartao/cadastrar-cartao';
	import { TabsPrincipalPage } from '../usr_tabs-principal/tabs-principal';
	import { ContatoPage } from '../contato/contato';
  import { LoginPage } from '../rcd_login/login';

	@IonicPage()
	@Component({
		selector: 'page-home',
			templateUrl: 'home.html'
	})
	export class HomePage {
		d: object;
		g: any;
		company: string;
		title: string;
		constructor(public navCtrl: NavController, public plt: Platform, public storage: Storage, public vibration: Vibration, private ga: GoogleAnalytics, public translateService: TranslateService){
			this.d = new Display();
			this.g = new Global();

			this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
				this.company = value;
			});
			this.translateService.get('PG_HOME_TITULO').subscribe((value) => {
				this.title = value;
			});

			plt.ready().then(() => {
					/*Google Analytics*/
				this.ga.startTrackerWithId(this.g.codeGA)
				.then(() => {
				this.ga.trackView(this.company + '/' + this.title);
				})
				.catch(e => console.log('Erro ao iniciar Google Analytics', e));
			});
		}
		goToUserLogin(){
			//this.vibration.vibrate(50);
			this.storage.get('saveCard').then((val) => {
				if(val == true){
					this.storage.get('userData').then((val) => {
						if(val){
							this.navCtrl.push(TabsPrincipalPage);
						}else{
							this.navCtrl.push(CadastrarCartaoPage);
						}
					});
				}else{
					this.storage.get('saveCpf').then((val) => {
						if(val == true){
							this.storage.get('userData').then((val) => {
								if(val){
									this.navCtrl.push(TabsPrincipalPage);
								}else{
									this.navCtrl.push(CadastrarCartaoPage);
								}
							});
						}else{
							this.navCtrl.push(CadastrarCartaoPage);
						}
					});
				}
			});
		}

    goToMerchantLogin(){
      this.navCtrl.push(LoginPage);
    }

		goToContact(){
			//this.vibration.vibrate(50);
			this.navCtrl.push(ContatoPage);
		}
	}
