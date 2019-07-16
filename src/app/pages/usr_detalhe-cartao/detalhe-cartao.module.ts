import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DetalheCartaoPage } from './detalhe-cartao';

@NgModule({
  declarations: [
    DetalheCartaoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheCartaoPage),
    TranslateModule.forChild()
  ],
  exports: [
    DetalheCartaoPage
  ]
})
export class DetalheCartaoPageModule {}
