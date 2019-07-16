import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, Platform } from 'ionic-angular';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Storage } from '@ionic/storage';
import { MapaRedeCredenciadaPage } from '../usr_mapa-rede-credenciada/mapa-rede-credenciada';

@IonicPage()
@Component({
  selector: 'page-detalhe-rede-credenciada',
  templateUrl: 'detalhe-rede-credenciada.html',
})
export class DetalheRedeCredenciadaPage {
  g: any;	
  rc: object;
  formatedPhone: string;
  company: string;	
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public viewCtrl: ViewController, public alertCtrl: AlertController, public storage: Storage, public toastCtrl: ToastController, private ga: GoogleAnalytics, public translateService: TranslateService) {
  	this.g = new Global();
  	this.rc = navParams.get('rc');
  	this.formatedPhone = this.g.formatPhone(this.g.onlyNumbers(this.rc['r_telefone']));
	
	this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
	
	plt.ready().then(() => { 
      /*Google Analytics*/
	  this.ga.startTrackerWithId(this.g.codeGA)
	  .then(() => {
		this.ga.trackView(this.company + '/' + 'Rede ' + this.rc['r_nome_fantasia']);
	  })
	  .catch(e => console.log('Erro ao iniciar Google Analytics', e));	  
    });
  }

  closeModal(){
  	this.viewCtrl.dismiss();
  }
  addFavorite(){
    let alert = this.alertCtrl.create({
      title: 'Deseja adicionar essa rede aos favoritos?',
      message: this.rc['r_nome_fantasia'],
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
              this.storage.get('favoritesMerchant').then((data) =>{
                if(data != null){
                  let c = this.rc['r_nome_fantasia'];
                  let n = data.filter(function (val){
                    return val.r_nome_fantasia == c;
                  });
                  if(n.length == 0){
                    data.push(this.rc);
                    this.storage.set('favoritesMerchant', data);
                    this.toast(this.rc['r_nome_fantasia'] + ' adicionada com sucesso', '2000', 'top', 'success');
                  }else{
                    this.toast('Ops ' + this.rc['r_nome_fantasia'] + ' já esta na sua lista de favoritos', '2000', 'top', 'error');
                  }
                }else{
                  let array = [];
                  array.push(this.rc);
                  this.storage.set('favoritesMerchant', array);
                  this.toast(this.rc['r_nome_fantasia'] + ' adicionada com sucesso', '2000', 'top', 'success');
                }
                
              });
          }
        }
      ]
    });
    alert.present(); 
  }
  goToMap(){
  	this.navCtrl.push(MapaRedeCredenciadaPage, {
      rc: this.rc
    });
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
