import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendaQtdParcelasPage } from './venda-qtd-parcelas';

@NgModule({
  declarations: [
    VendaQtdParcelasPage,
  ],
  imports: [
    IonicPageModule.forChild(VendaQtdParcelasPage),
  ],
  exports: [
    VendaQtdParcelasPage
  ]
})
export class VendaQtdParcelasPageModule {}
