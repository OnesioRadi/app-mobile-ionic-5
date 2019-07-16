import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComprovantePage } from './comprovante';

@NgModule({
  declarations: [
    ComprovantePage,
  ],
  imports: [
    IonicPageModule.forChild(ComprovantePage),
  ],
  exports: [
    ComprovantePage
  ]
})
export class ComprovantePageModule {}
