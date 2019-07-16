import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExtratoVendaDetalhePage } from './extrato-venda-detalhe';

@NgModule({
  declarations: [
    ExtratoVendaDetalhePage,
  ],
  imports: [
    IonicPageModule.forChild(ExtratoVendaDetalhePage),
  ],
  exports: [
    ExtratoVendaDetalhePage
  ]
})
export class ExtratoVendaDetalhePageModule {}
