import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferenciaCartaoDestinoPage } from './transferencia-cartao-destino';

@NgModule({
  declarations: [
    TransferenciaCartaoDestinoPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferenciaCartaoDestinoPage),
  ],
  exports: [
    TransferenciaCartaoDestinoPage
  ]
})
export class TransferenciaCartaoDestinoPageModule {}
