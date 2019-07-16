import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnviarComprovantePage } from './enviar-comprovante';

@NgModule({
  declarations: [
    EnviarComprovantePage,
  ],
  imports: [
    IonicPageModule.forChild(EnviarComprovantePage),
  ],
  exports: [
    EnviarComprovantePage
  ]
})
export class EnviarComprovantePageModule {}
