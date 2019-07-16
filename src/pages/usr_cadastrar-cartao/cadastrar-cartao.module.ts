import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CadastrarCartaoPage } from './cadastrar-cartao';

@NgModule({
  declarations: [
    CadastrarCartaoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastrarCartaoPage),
    TranslateModule.forChild()
  ],
  exports: [
    CadastrarCartaoPage
  ]
})
export class CadastrarCartaoPageModule {}
