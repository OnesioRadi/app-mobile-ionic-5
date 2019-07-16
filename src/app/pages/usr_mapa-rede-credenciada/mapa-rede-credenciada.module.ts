import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapaRedeCredenciadaPage } from './mapa-rede-credenciada';

@NgModule({
  declarations: [
    MapaRedeCredenciadaPage,
  ],
  imports: [
    IonicPageModule.forChild(MapaRedeCredenciadaPage),
  ],
  exports: [
    MapaRedeCredenciadaPage
  ]
})
export class MapaRedeCredenciadaPageModule {}
