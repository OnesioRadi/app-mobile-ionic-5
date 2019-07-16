import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendaCartaoPage } from './venda-cartao';

@NgModule({
  declarations: [
    VendaCartaoPage,
  ],
  imports: [
    IonicPageModule.forChild(VendaCartaoPage),
  ],
  exports: [
    VendaCartaoPage
  ]
})
export class VendaCartaoPageModule {}
