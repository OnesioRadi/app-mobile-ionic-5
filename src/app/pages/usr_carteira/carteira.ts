import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController, Platform, ViewController, Content  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { DetalheCartaoPage } from '../usr_detalhe-cartao/detalhe-cartao';
import { Global } from '../../global/global';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-carteira',
  templateUrl: 'carteira.html',
})
export class CarteiraPage {
  @ViewChild(Content) content: Content;
  cards: object;
  load: any;
  g: any;
  company: string;
  title: string;

  constructor(public navCtrl: NavController, public plt: Platform, public navParams: NavParams, public modalCtrl: ModalController, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, public viewCtrl: ViewController, public storage: Storage, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics){
    console.log(this.navParams.get('teste'));
    
    this.toast('Toque no cartão para acessar seu Saldo, Extrato, Bloqueio e Desbloqueio', '4000', 'bottom', '');

    //constantes
    this.g = new Global();	  
    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });
    this.translateService.get('PG_CARTEIRA_TITULO').subscribe((value) => {
		  this.title = value;
	  });

	  plt.ready().then(() => { 
    /*Google Analytics*/
		this.ga.startTrackerWithId(this.g.codeGA)
		.then(() => {
			this.ga.trackView(this.company + '/' + this.title);
		})
		.catch(e => console.log('Erro ao iniciar Google Analytics', e));	  
    });
  }

  ionViewDidEnter() {
    //recebe cartoes do usuario
    if(this.navParams.data.length > 0){
      this.cards = this.navParams.data;
      //Pega dados do usuario salvos se existirem
    }else{
      this.storage.get('userData').then((data) =>{
        if(data){
          this.apiCardsUser(this.g.urlApi, data);
          this.content.resize();
        }
      }); 
    }
  }

  openCardModal(event, card) {

    //this.vibration.vibrate(10);

    console.log(card.r_status);
    if(card.r_status != 3){
      let contactModal = this.modalCtrl.create(DetalheCartaoPage,{
        dataCard: card
       });
       contactModal.present();
    }else{
      this.toast('Cartão Cancelado, por favor entre em contato com a administratora.', '4500', 'top', 'notice')
    }
		
 	}
  updateCards(){
    //this.vibration.vibrate(10);
    console.log(this.storage.get('userData'));
    this.storage.get('userData').then((data) =>{
      console.log(data.p_cpf);
      if(data){
        this.apiCardsUser(this.g.urlApi, data);
      }
    });
  }
  //requisicoes
  apiCardsUser(url, arraySend){
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        if(data.message == 'Sucesso'){
          this.cards = data.result
          // this.toast('Carteira atualizada com sucesso', '1500', 'top', 'success');
        }else{
          this.toast('Não foi possível atualizar os cartões do usuário, clique em atualizar', '4000', 'top', 'error');
        }
      },  
      err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => this.load.dismiss() 
    );
  }
  //loading
  loading(title){
    this.load = this.loadingCtrl.create({
      content: '<h5>'+title+'</h5>'
    });
    this.load.present();
    
  }
  //toast
  toast(message, duration, position, cssClass){
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