import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecargaCartaoPage } from './recarga-cartao';

@NgModule({
  declarations: [
    RecargaCartaoPage,
  ],
  imports: [
    IonicPageModule.forChild(RecargaCartaoPage),
  ],
  exports: [
    RecargaCartaoPage
  ]
})
export class RecargaCartaoPageModule {}
