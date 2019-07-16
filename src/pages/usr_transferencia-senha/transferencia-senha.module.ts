import { NgModule } from '@angular/core'; 
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TransferenciaSenhaPage } from './transferencia-senha';

@NgModule({
  declarations: [
    TransferenciaSenhaPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferenciaSenhaPage),
    TranslateModule.forChild()
  ],
  exports: [
    TransferenciaSenhaPage
  ]
})
export class TransferenciaSenhaPageModule {}
