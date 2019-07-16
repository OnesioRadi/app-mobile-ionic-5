import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlterarSenhaPage } from './alterar-senha';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AlterarSenhaPage,
  ],
  imports: [
    IonicPageModule.forChild(AlterarSenhaPage),
    TranslateModule.forChild()
  ],
  exports: [
    AlterarSenhaPage
  ]
})
export class AlterarSenhaPageModule {}
