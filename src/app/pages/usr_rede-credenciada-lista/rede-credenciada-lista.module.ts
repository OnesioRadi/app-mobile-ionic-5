import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RedeCredenciadaListaPage } from './rede-credenciada-lista';

@NgModule({
  declarations: [
    RedeCredenciadaListaPage,
  ],
  imports: [
    IonicPageModule.forChild(RedeCredenciadaListaPage),
  ],
  exports: [
    RedeCredenciadaListaPage
  ]
})
export class RedeCredenciadaListaPageModule {}
