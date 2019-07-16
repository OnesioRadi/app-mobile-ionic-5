import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExtratoVendaPage } from './extrato-venda';

@NgModule({
  declarations: [
    ExtratoVendaPage,
  ],
  imports: [
    IonicPageModule.forChild(ExtratoVendaPage),
  ],
  exports: [
    ExtratoVendaPage
  ]
})
export class ExtratoVendaPageModule {}
