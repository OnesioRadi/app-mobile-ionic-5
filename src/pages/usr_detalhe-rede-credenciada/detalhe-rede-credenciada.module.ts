import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalheRedeCredenciadaPage } from './detalhe-rede-credenciada';

@NgModule({
  declarations: [
    DetalheRedeCredenciadaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheRedeCredenciadaPage),
  ],
  exports: [
    DetalheRedeCredenciadaPage
  ]
})
export class DetalheRedeCredenciadaPageModule {}
