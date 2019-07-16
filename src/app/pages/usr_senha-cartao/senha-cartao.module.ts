import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SenhaCartaoPage } from './senha-cartao';

@NgModule({
  declarations: [
    SenhaCartaoPage,
  ],
  imports: [
    IonicPageModule.forChild(SenhaCartaoPage),
    TranslateModule.forChild()
  ],
  exports: [
    SenhaCartaoPage
  ]
})
export class SenhaCartaoPageModule {}
