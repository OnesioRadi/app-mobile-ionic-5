import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { RecargaCelularPage } from './recarga-celular';


@NgModule({
  declarations: [
    RecargaCelularPage,
  ],
  imports: [
    IonicPageModule.forChild(RecargaCelularPage),
    TranslateModule.forChild()
  ],
  exports: [
    RecargaCelularPage
  ]
})
export class RecargaCelularPageModule {}
