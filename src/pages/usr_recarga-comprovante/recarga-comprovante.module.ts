import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { RecargaComprovantePage } from './recarga-comprovante';




@NgModule({
  declarations: [
    RecargaComprovantePage,
  ],
  imports: [
    IonicPageModule.forChild(RecargaComprovantePage),
    TranslateModule.forChild()
  ],
  exports: [
    RecargaComprovantePage
  ]
})
export class RecargaComprovantePageModule {}
