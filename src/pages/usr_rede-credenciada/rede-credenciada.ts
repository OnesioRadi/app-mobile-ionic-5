import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Vibration } from '@ionic-native/vibration';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { DetalheRedeCredenciadaPage } from '../usr_detalhe-rede-credenciada/detalhe-rede-credenciada';
import { RedeCredenciadaListaPage } from '../usr_rede-credenciada-lista/rede-credenciada-lista';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-rede-credenciada',
  templateUrl: 'rede-credenciada.html',
})
export class RedeCredenciadaPage {

  segmentTab: any;
  load: any;
  g: any;
  titlePage: string;
  company: string;
  lat: number;
  lon: number;
  idCityUser: number;
  skip: number;
  idEmpresa: number;
  btnViewMore: boolean;
  loadLocation: boolean;
  rc: any[];
  favoriteRc: any[];
  uf: any;
  city: any;
  segment: any;
  ufs: any[];
  citys: any[];
  segments: any[];

  constructor(public navCtrl: NavController, public plt: Platform, public navParams: NavParams, public modalCtrl: ModalController, public translateService: TranslateService, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, public diagnostic: Diagnostic, public geolocation: Geolocation, public storage: Storage, private alertCtrl: AlertController, public vibration: Vibration, private ga: GoogleAnalytics) {
    //constantes
    this.g = new Global();
    this.loadLocation = true;
    this.segmentTab = 'rc-proximidade';
    this.storage.get('userData').then((data) => {
      this.idCityUser = data.p_cidade_usuario;
      this.uf = data.p_estado_usuario;
    });

    this.translateService.get('PG_REDE-CREDENCIADA_SEGMENT_RC_PROXIMIDADE').subscribe((value) => {
      this.titlePage = value;
    });
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    });
    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA).then(() => {
        this.ga.trackView(this.company + '/' + this.titlePage);
      })
        .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });

    this.rc = [];
  }

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.skip = 1;
      this.lat = resp.coords.latitude;
      this.lon = resp.coords.longitude;

      if (this.idCityUser == null) {
        this.idCityUser = 0;
      }

      this.apiNextMerchant(this.g.urlApi, { procedimento: 51, p_empresa: this.idEmpresa, p_latitude: this.lat, p_longitude: this.lon, p_id_cidade: this.idCityUser, p_first: 10, p_skip: this.skip });
    }).catch((error) => {
      this.toast('Erro ao sua Geolocalização por favor verifique se seu GPS esta habilitado', '3500', 'top', 'error');
    });
  }

  //segments
  segmentChanged(event, item) {
    switch (item) {
      case 'rc-proximidade':
        //this.vibration.vibrate(50);
        this.translateService.get('PG_REDE-CREDENCIADA_SEGMENT_RC_PROXIMIDADE').subscribe((value) => {
          this.titlePage = value;
        });
        break;
      case 'rc-favoritos':
        //this.vibration.vibrate(50);
        this.translateService.get('PG_REDE-CREDENCIADA_SEGMENT_RC_FAVORITOS').subscribe((value) => {
          this.titlePage = value;
          this.loadFavoritesMerchant();
        });
        break;
      case 'rc-busca-avancada':
        //this.vibration.vibrate(50);
        this.translateService.get('PG_REDE-CREDENCIADA_SEGMENT_RC_BUSCA_AVANCADA').subscribe((value) => {
          this.titlePage = value;
          this.apiLoadUfs(this.g.urlApi, { procedimento: 21, p_empresa: this.idEmpresa });
        });
        break;
    }
  }

  //requisicoes
  apiNextMerchant(url, arraySend) {
    this.loadLocation = false;
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log(body);
    this.http.post(url, body, options)
      .map(res => res.json(), this.loading('Carregando redes...'))
      .subscribe(
        data => {
          if (data.message == 'Sucesso') {
            if (this.rc.length == 0) {
              this.rc = data.result;
            } else {
              this.rc = this.rc.concat(data.result);
            }
            this.btnViewMore = (data.result.length > 0) ? true : false;
            this.skip = this.skip + 10;
          } else {
            this.toast('Erro ao carregar as Redes Credenciada próximas a você', '3500', 'top', 'error');
          }
        },
        err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível, por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
        () => this.load.dismiss()
      );
  }

  apiLoadUfs(url, arraySend) {

    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
      .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
        data => {
          if (data.message == 'Sucesso') {
            this.ufs = data.result;
          } else {
            this.toast('Erro ao carregar os estados disponíveis', '3500', 'top', 'error');
          }
        },
        err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível, por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
        () => this.apiLoadCitys(this.g.urlApi, { procedimento: 22, p_sigla_estado: this.uf, p_empresa: this.idEmpresa })
      );
  }

  apiLoadCitys(url, arraySend) {
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });    
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
      .map(res => res.json())
      .subscribe(
        data => {
          if (data.message == 'Sucesso') {
            this.citys = data.result;
            // this.city = this.idCityUser;
            this.city = 0;
          } else {
            this.toast('Erro ao carregar as cidades disponíveis', '3500', 'top', 'error');
          }
        },
        err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível, por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
        () => this.apiLoadSegments(this.g.urlApi, { procedimento: 23, p_empresa: this.idEmpresa, p_sigla_estado: this.uf, p_id_cidade: this.city })
      );
  }

  // Cidades
  CityChanged(event, item) {
    this.apiLoadCitys(this.g.urlApi, { procedimento: 22, p_sigla_estado: this.uf, p_empresa: this.idEmpresa });
  }

  // Segmentos
  SegmentChanged(event, item) {
    this.apiLoadSegments(this.g.urlApi, { procedimento: 23, p_empresa: this.idEmpresa, p_sigla_estado: this.uf, p_id_cidade: this.city })
  }

  apiLoadSegments(url, arraySend) {
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
      .map(res => res.json())
      .subscribe(
        data => {
          if (data.message == 'Sucesso') {
            if (data.result != undefined && data.result != ""){
              this.segments = data.result;
              this.segment = 0;
            } else{
              this.toast('Não há segmentos disponíveis para a cidade selecionada.', '3500', 'top', 'error');
            }
          } else {
            // this.toast('Erro ao carregar os segmentos disponíveis', '3500', 'top', 'error');
          }
        },
        err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível, por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
        () => this.load.dismiss()
      );
  }

  loadFavoritesMerchant() {
    this.storage.get('favoritesMerchant').then((data) => {
      if (data != null) {
        this.favoriteRc = data;
      } else {

      }
    });
  }

  addFavorite(item) {
    //this.vibration.vibrate(100);  
    let alert = this.alertCtrl.create({
      title: 'Deseja adicionar essa rede aos favoritos?',
      message: item.r_nome_fantasia,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.storage.get('favoritesMerchant').then((data) => {
              if (data != null) {
                let n = data.filter(function (val) {
                  return val.r_nome_fantasia == item.r_nome_fantasia
                });
                if (n.length == 0) {
                  data.push(item);
                  this.storage.set('favoritesMerchant', data);
                  this.toast(item.r_nome_fantasia + ' adicionada com sucesso', '2000', 'top', 'success');
                } else {
                  this.toast('Ops ' + item.r_nome_fantasia + ' já esta na sua lista de favoritos', '2000', 'top', 'error');
                }
              } else {
                let array = [];
                array.push(item);
                this.storage.set('favoritesMerchant', array);
                this.toast(item.r_nome_fantasia + ' adicionada com sucesso', '2000', 'top', 'success');
              }

            });
          }
        }
      ]
    });
    alert.present();
  }
  removeFavorite(item) {
    //this.vibration.vibrate(100);
    let alert = this.alertCtrl.create({
      title: 'Deseja remover essa rede dos favoritos?',
      message: item.r_nome_fantasia,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.storage.get('favoritesMerchant').then((data) => {
              let n = [];
              n = data.filter(function (val) {
                return val.r_nome_fantasia !== item.r_nome_fantasia
              });
              if (n.length > 0) {
                this.storage.set('favoritesMerchant', n);
                this.favoriteRc = n;
              } else {
                this.storage.remove('favoritesMerchant');
                this.favoriteRc = null;
              }
            });

          }
        }
      ]
    });
    alert.present();
  }
  goToRcList() {
    this.navCtrl.push(RedeCredenciadaListaPage, {
      uf: this.uf,
      city: this.city,
      segment: this.segment
    });
  }
  modalRcDetail(event, r) {
    //this.vibration.vibrate(50);
    let detailModal = this.modalCtrl.create(DetalheRedeCredenciadaPage, {
      rc: r
    });
    detailModal.present();
  }
  viewMore() {
    //this.vibration.vibrate(50);
    this.apiNextMerchant(this.g.urlApi, { procedimento: 51, p_empresa: this.idEmpresa, p_latitude: this.lat, p_longitude: this.lon, p_id_cidade: this.idCityUser, p_first: 10, p_skip: this.skip });
  }
  //loading
  loading(title) {
    this.load = this.loadingCtrl.create({
      content: '<h5>' + title + '</h5>'
    });
    this.load.present();
  }
  //toast
  toast(message, duration, position, cssClass) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      cssClass: cssClass,
      dismissOnPageChange: true,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

}
