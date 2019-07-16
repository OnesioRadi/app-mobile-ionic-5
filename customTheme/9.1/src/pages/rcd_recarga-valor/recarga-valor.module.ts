import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecargaValorPage } from './recarga-valor';

@NgModule({
  declarations: [
    RecargaValorPage,
  ],
  imports: [
    IonicPageModule.forChild(RecargaValorPage),
  ],
  exports: [
    RecargaValorPage
  ]
})
export class RecargaValorPageModule {}
