import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { BloquearCartaoPage } from './bloquear-cartao';

@NgModule({
  declarations: [
    BloquearCartaoPage,
  ],
  imports: [
    IonicPageModule.forChild(BloquearCartaoPage),
    TranslateModule.forChild()
  ],
  exports: [
    BloquearCartaoPage
  ]
})
export class BloquearCartaoPageModule {}
