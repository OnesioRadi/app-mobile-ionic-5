import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfiguracoesRedePage } from './configuracoes-rede';

@NgModule({
  declarations: [
    ConfiguracoesRedePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfiguracoesRedePage),
  ],
  exports: [
    ConfiguracoesRedePage
  ]
})
export class ConfiguracoesRedePageModule {}
