import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Vibration } from '@ionic-native/vibration';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Storage } from '@ionic/storage';
import { Global } from '../../global/global';
import { DetalheRedeCredenciadaPage } from '../usr_detalhe-rede-credenciada/detalhe-rede-credenciada';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-rede-credenciada-lista',
  templateUrl: 'rede-credenciada-lista.html',
})
export class RedeCredenciadaListaPage {

  load: any;
  g: any;
  rc: any[];
  rcList: any[];
  idEmpresa: number;
  company: string;
  title: string;

  //
  public estado : String;
  public cidade : string;
  public segmento : string;

  //
  cartoes = JSON.parse(localStorage.getItem('cartoes'));
  //empresa = this.cartoes[0]['empresa'];

  constructor(public navCtrl: NavController, public plt: Platform, public navParams: NavParams, public modalCtrl: ModalController, public translateService: TranslateService, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, public storage: Storage, public alertCtrl: AlertController, public vibration: Vibration, private ga: GoogleAnalytics) {
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    });
    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
    this.translateService.get('PG_REDE-CREDENCIADA-LISTA_TITULO').subscribe((value) => {
      this.title = value;
    })

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA)
        .then(() => {
          this.ga.trackView(this.company + '/' + this.title);
        })
        .catch(e => console.log('Erro ao iniciar Google Analytics', e));
    });
    
    this.estado = navParams.get("uf");
    this.cidade = navParams.get("city");
    this.segmento = navParams.get("segment");

    //constantes
    this.g = new Global();
    this.apiMerchant(this.g.urlApi, { procedimento: 24, p_empresa: this.idEmpresa, p_sigla_uf: navParams.get('uf'), p_id_cidade: navParams.get('city'), p_id_segmento: navParams.get('segment') });
  }

  //requisicoes
  apiMerchant(url, arraySend) {
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
      .map(res => res.json(), this.loading('Carregando redes...'))
      .subscribe(
        data => {
          if (data.message == 'Sucesso') {
            this.rc = data.result;

            this.rcList = data.result;

          } else {
            this.toast('Erro ao carregar as Redes Credenciada próximas a você', '3500', 'top', 'error');
          }
        },
        err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível, por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
        () => this.load.dismiss()
      );
  }

  modalRcDetail(event, r) {
    //this.vibration.vibrate(50);
    let detailModal = this.modalCtrl.create(DetalheRedeCredenciadaPage, {
      rc: r
    });
    detailModal.present();
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
  //loading
  loading(title) {
    this.load = this.loadingCtrl.create({
      content: '<h5>' + title + '</h5>'
    });
    this.load.present();
  }

  last12Months() {
    let today = new Date();
    let year = today.getFullYear();
    let aMonth = today.getMonth();
    let months = [], i;
    let month = new Array('01-Janeiro', '02-Fevereiro', '03-Março', '04-Abril', '05-Maio', '06-Junho', '07-Julho', '08-Agosto', '09-Setembro', '10-Outubro', '11-Novembro', '12-Dezembro');

    for (i = 0; i < 12; i++) {
      months.push(month[aMonth] + '/' + year);
      aMonth--;
      if (aMonth < 0) {
        aMonth = 11;
        --year;
      }
    }
    return months;
  }

  filtraRede(searchbar: any) : void {
    let _searchbar = searchbar.srcElement.value;

    if(_searchbar == ''){
      this.consomeApiRede();

      return;
    }else{

      console.log('valor da busca --> ', searchbar.srcElement.value);
      let _param;

      if(_searchbar == null){
        _param = '';
      }else{
        _param = new RegExp(_searchbar.toUpperCase().trim());
      }
  
      this.rc = this.rc.filter((obj, index) => {
        console.log('Nome Fant --> ', obj.r_nome_fantasia);
        if (obj.r_nome_fantasia !== null) {
          if (obj.r_nome_fantasia.search(_param) > -1){
            console.log('DENTRO DO FILTER 1 --> ', obj);
            this.rc.push(obj);
            return this.rc;
          }
        }
      });
    }
  }

  cancelaFiltro(searchbar) {
    //this.consomeApiRedeCredenciada(24, this.empresa, this.estado, this.cidade, this.segmento);
    this.apiMerchant(this.g.urlApi, { procedimento: 24, p_empresa: this.idEmpresa, p_sigla_uf: this.estado, p_id_cidade: this.cidade, p_id_segmento: this.segmento });
  }

  limpaFiltro(searchbar) {
    this.apiMerchant(this.g.urlApi, { procedimento: 24, p_empresa: this.idEmpresa, p_sigla_uf: this.estado, p_id_cidade: this.cidade, p_id_segmento: this.segmento });
  }

  consomeApiRede() {
    this.apiMerchant(this.g.urlApi, { procedimento: 24, p_empresa: this.idEmpresa, p_sigla_uf: this.estado, p_id_cidade: this.cidade, p_id_segmento: this.segmento });
  }

  atualizaArrayCb(array) {
    let cont = this.verificaCartoesPrepago();
    for (var i in array) {
      if (array[i].r_cash_back == 'N' || cont < 1) {
        array[i].r_cash_back = true;
      } else {
        array[i].r_cash_back = false;
      }
    }
  }

  verificaCartoesPrepago() {

    let cont = 0;
    for (let i = 0; i < this.cartoes.length; i++) {
      if (this.cartoes[i]['cashBack'] == 'S') {
        cont++;
      }

      if (this.cartoes[i]['cashBack'] == 'N') {
        cont--;
      }
    }

    if (localStorage.getItem('cartaoSelecionado') == 'S') {
      cont++;
    }
    return cont;
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
