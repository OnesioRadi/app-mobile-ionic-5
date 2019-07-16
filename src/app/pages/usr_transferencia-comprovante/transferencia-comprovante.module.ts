import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferenciaComprovantePage } from './transferencia-comprovante';

@NgModule({
  declarations: [
    TransferenciaComprovantePage,
  ],
  imports: [
    IonicPageModule.forChild(TransferenciaComprovantePage),
  ],
  exports: [
    TransferenciaComprovantePage
  ]
})
export class TransferenciaComprovantePageModule {}
