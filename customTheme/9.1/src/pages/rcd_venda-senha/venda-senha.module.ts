import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendaSenhaPage } from './venda-senha';

@NgModule({
  declarations: [
    VendaSenhaPage,
  ],
  imports: [
    IonicPageModule.forChild(VendaSenhaPage),
  ],
  exports: [
    VendaSenhaPage
  ]
})
export class VendaSenhaPageModule {}
