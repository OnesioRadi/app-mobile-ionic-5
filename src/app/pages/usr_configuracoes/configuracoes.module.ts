import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ConfiguracoesPage } from './configuracoes';

@NgModule({
  declarations: [
    ConfiguracoesPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfiguracoesPage),
    TranslateModule.forChild()
  ],
  exports: [
    ConfiguracoesPage
  ]
})
export class ConfiguracoesPageModule {}
