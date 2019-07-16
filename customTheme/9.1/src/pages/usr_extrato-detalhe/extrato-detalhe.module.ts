import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExtratoDetalhePage } from './extrato-detalhe';

@NgModule({
  declarations: [
    ExtratoDetalhePage,
  ],
  imports: [
    IonicPageModule.forChild(ExtratoDetalhePage),
  ],
  exports: [
    ExtratoDetalhePage
  ]
})
export class ExtratoDetalhePageModule {}
