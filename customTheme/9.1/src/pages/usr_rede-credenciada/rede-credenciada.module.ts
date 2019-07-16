import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { RedeCredenciadaPage } from './rede-credenciada';

@NgModule({
  declarations: [
    RedeCredenciadaPage,
  ],
  imports: [
    IonicPageModule.forChild(RedeCredenciadaPage),
    TranslateModule.forChild()
  ],
  exports: [
    RedeCredenciadaPage
  ]
})
export class RedeCredenciadaPageModule {}
