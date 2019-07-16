import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
import { HeaderColor } from '@ionic-native/header-color';
import { Vibration } from '@ionic-native/vibration';
import { IonicStorageModule } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { IonDigitKeyboard } from '../components/ion-digit-keyboard/ion-digit-keyboard.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';

/*Labels translate*/
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';

import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
//Pages
import { HomePage } from '../pages/home/home';
import { CadastrarCartaoPage } from '../pages/usr_cadastrar-cartao/cadastrar-cartao';
import { SenhaCartaoPage } from '../pages/usr_senha-cartao/senha-cartao';
import { TabsPrincipalPage } from '../pages/usr_tabs-principal/tabs-principal';
import { CarteiraPage } from '../pages/usr_carteira/carteira';
import { RedeCredenciadaPage } from '../pages/usr_rede-credenciada/rede-credenciada';
import { ConfiguracoesPage } from '../pages/usr_configuracoes/configuracoes';
import { DetalheCartaoPage } from '../pages/usr_detalhe-cartao/detalhe-cartao';
import { PgtoBoletoPage } from '../pages/usr_pgto-boleto/pgto-boleto';
import { ExtratoPage } from '../pages/usr_extrato/extrato';
import { ExtratoDetalhePage } from '../pages/usr_extrato-detalhe/extrato-detalhe';
import { ContatoPage } from '../pages/contato/contato';
import { ChatPage } from '../pages/chat/chat';
import { TestePage } from '../pages/teste/teste';
import { DetalheRedeCredenciadaPage } from '../pages/usr_detalhe-rede-credenciada/detalhe-rede-credenciada';
import { MapaRedeCredenciadaPage } from '../pages/usr_mapa-rede-credenciada/mapa-rede-credenciada';
import { RedeCredenciadaListaPage } from '../pages/usr_rede-credenciada-lista/rede-credenciada-lista';
import { BloquearCartaoPage } from '../pages/usr_bloquear-cartao/bloquear-cartao';
import { AlterarSenhaPage } from '../pages/usr_alterar-senha/alterar-senha';
import { TransferenciaCartaoDestinoPage } from '../pages/usr_transferencia-cartao-destino/transferencia-cartao-destino';
import { TransferenciaValorPage } from '../pages/usr_transferencia-valor/transferencia-valor';
import { TransferenciaSenhaPage } from '../pages/usr_transferencia-senha/transferencia-senha';
import { TransferenciaComprovantePage } from '../pages/usr_transferencia-comprovante/transferencia-comprovante';
import { LoginPage } from '../pages/rcd_login/login';
import { MenuPrincipalPage } from '../pages/rcd_menu-principal/menu-principal';
import { ConfiguracoesRedePage } from '../pages/rcd_configuracoes-rede/configuracoes-rede';
import { SaldoCartaoPage } from '../pages/rcd_saldo-cartao/saldo-cartao';
import { VendaCartaoPage } from '../pages/rcd_venda-cartao/venda-cartao';
import { VendaSenhaPage } from '../pages/rcd_venda-senha/venda-senha';
import { VendaValorPage } from '../pages/rcd_venda-valor/venda-valor';
import { VendaQtdParcelasPage } from '../pages/rcd_venda-qtd-parcelas/venda-qtd-parcelas';
import { EnviarComprovantePage } from '../pages/rcd_enviar-comprovante/enviar-comprovante';
import { RecargaCartaoPage } from '../pages/rcd_recarga-cartao/recarga-cartao';
import { RecargaValorPage } from '../pages/rcd_recarga-valor/recarga-valor';
import { ComprovantePage } from '../pages/rcd_comprovante/comprovante';
import { ExtratoVendaPage } from '../pages/rcd_extrato-venda/extrato-venda';
import { ExtratoVendaDetalhePage } from '../pages/rcd_extrato-venda-detalhe/extrato-venda-detalhe';

//Pipes
import { CardSpacePipe } from '../pipes/card-space/card-space';
import { CurrencyRealPipe } from '../pipes/currency-real/currency-real';
//Injectables
import {Utils} from './utils';
import { BarcodeValidatesProvider } from '../providers/barcode-validates/barcode-validates';


export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/config/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
	  CadastrarCartaoPage,
    SenhaCartaoPage,
    TabsPrincipalPage,
    CarteiraPage,
    RedeCredenciadaPage,
    ConfiguracoesPage,
    DetalheCartaoPage,
    PgtoBoletoPage,
    ExtratoPage,
    ExtratoDetalhePage,
    ContatoPage,
    ChatPage,
    TestePage,
    DetalheRedeCredenciadaPage,
    MapaRedeCredenciadaPage,
    RedeCredenciadaListaPage,
    BloquearCartaoPage,
    AlterarSenhaPage,
    TransferenciaCartaoDestinoPage,
    TransferenciaValorPage,
    TransferenciaSenhaPage,
    TransferenciaComprovantePage,
    LoginPage,
    MenuPrincipalPage,
    ConfiguracoesRedePage,
    SaldoCartaoPage,
    VendaCartaoPage,
    VendaSenhaPage,
    VendaValorPage,
    VendaQtdParcelasPage,
    ComprovantePage,
    EnviarComprovantePage,
    RecargaCartaoPage,
    RecargaValorPage,
    ExtratoVendaPage,
    ExtratoVendaDetalhePage,
    CardSpacePipe,
    CurrencyRealPipe
  ],
  imports: [
    BrowserModule,
	  HttpModule,
    IonDigitKeyboard,    
	  TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
     }
    ),
    IonicStorageModule.forRoot({
      name: 'orgcard_mobile',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
	  CadastrarCartaoPage,
    SenhaCartaoPage,
    TabsPrincipalPage,
    CarteiraPage,
    RedeCredenciadaPage,
    ConfiguracoesPage,
    DetalheCartaoPage,
    PgtoBoletoPage,
    ExtratoPage,
    ExtratoDetalhePage,
    ContatoPage,
    ChatPage,
    TestePage,
    DetalheRedeCredenciadaPage,
    MapaRedeCredenciadaPage,
    RedeCredenciadaListaPage,
    BloquearCartaoPage,
    AlterarSenhaPage,
    TransferenciaCartaoDestinoPage,
    TransferenciaValorPage,
    TransferenciaSenhaPage,
    TransferenciaComprovantePage,
    LoginPage,
    MenuPrincipalPage,
    ConfiguracoesRedePage,
    SaldoCartaoPage,
    VendaCartaoPage,
    VendaSenhaPage,
    VendaValorPage,
    VendaQtdParcelasPage,
    ComprovantePage,
    EnviarComprovantePage,
    RecargaCartaoPage,
    RecargaValorPage,
    ExtratoVendaPage,
    ExtratoVendaDetalhePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HeaderColor,
    Diagnostic,
    Device,
    BarcodeScanner,
    Camera,
    Geolocation,
    Vibration,
	  GoogleAnalytics,
    Utils,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeValidatesProvider
  ]
})
export class AppModule {}
