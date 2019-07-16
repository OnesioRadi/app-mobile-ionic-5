import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferenciaValorPage } from './transferencia-valor';

@NgModule({
  declarations: [
    TransferenciaValorPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferenciaValorPage),
  ],
  exports: [
    TransferenciaValorPage
  ]
})
export class TransferenciaValorPageModule {}
