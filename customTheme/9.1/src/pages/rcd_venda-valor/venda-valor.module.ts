import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendaValorPage } from './venda-valor';

@NgModule({
  declarations: [
    VendaValorPage,
  ],
  imports: [
    IonicPageModule.forChild(VendaValorPage),
  ],
  exports: [
    VendaValorPage
  ]
})
export class VendaValorPageModule {}
