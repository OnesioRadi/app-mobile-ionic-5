import { PgtoBoletoPage } from './pgto-boleto';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PgtoBoletoPage,
  ],
  imports: [
    IonicPageModule.forChild(PgtoBoletoPage),
  ],
  exports: [
    PgtoBoletoPage
  ]
})
export class BarcodeScannerPageModule {}
