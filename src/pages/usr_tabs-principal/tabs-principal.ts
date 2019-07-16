import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CarteiraPage } from '../usr_carteira/carteira';
import { RedeCredenciadaPage } from '../usr_rede-credenciada/rede-credenciada';
import { ConfiguracoesPage } from '../usr_configuracoes/configuracoes';

@Component({
  selector: 'page-tabs-principal',
  templateUrl: 'tabs-principal.html'
})

@IonicPage()
export class TabsPrincipalPage {

	// @ViewChild('myTabs') tabRef: Tabs;
  
  // ionViewDidEnter() {
  //   //this.tabRef.select(0);
  //   console.log('Funcionou perfeitamente');
  // }
	
	
  carteiraRoot = CarteiraPage;
  redeCredenciadaRoot = RedeCredenciadaPage;
  configuracoesRoot = ConfiguracoesPage;

  cards: object;
  userDataSaved: object;
  constructor(public navCtrl: NavController, public navParams: NavParams) {   
  	if(this.navParams.get('cards')){
      this.cards = this.navParams.get('cards');	

      console.log(this.cards);
  	}else{
  		this.cards = [];
  	}
	}
}
