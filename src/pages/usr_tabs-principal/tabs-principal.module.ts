import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabsPrincipalPage } from './tabs-principal';
import { CarteiraPage } from '../usr_carteira/carteira';
import { RedeCredenciadaPage } from '../usr_rede-credenciada/rede-credenciada';
import { ConfiguracoesPage } from '../usr_configuracoes/configuracoes';

@NgModule({
  declarations: [
    TabsPrincipalPage,
    CarteiraPage,
    RedeCredenciadaPage,
    ConfiguracoesPage
  ],
  imports: [
    IonicPageModule.forChild(TabsPrincipalPage),
    TranslateModule.forChild()
  ]
})
export class TabsPrincipalPageModule {}
