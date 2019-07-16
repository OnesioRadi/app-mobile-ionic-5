import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaldoCartaoPage } from './saldo-cartao';

@NgModule({
  declarations: [
    SaldoCartaoPage,
  ],
  imports: [
    IonicPageModule.forChild(SaldoCartaoPage),
  ],
  exports: [
    SaldoCartaoPage
  ]
})
export class SaldoCartaoPageModule {}
