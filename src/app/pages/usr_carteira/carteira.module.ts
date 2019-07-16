import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CarteiraPage } from './carteira';
import { CardSpacePipe } from '../../pipes/card-space/card-space';
import { CurrencyRealPipe } from '../../pipes/currency-real/currency-real';

@NgModule({
  declarations: [
    CarteiraPage,
  ],
  imports: [
    IonicPageModule.forChild(CarteiraPage),
    TranslateModule.forChild(),
    CardSpacePipe,
    CurrencyRealPipe
  ],
  exports: [
    CarteiraPage
  ]
})
export class CarteiraPageModule {}
