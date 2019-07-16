import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
	selector: 'page-alterar-senha',
	templateUrl: 'alterar-senha.html',
})

export class AlterarSenhaPage {
	passType: string;
	currentPass: string;
	newPass: string;
	confirmNewPass: string;
	focus: string = '';
	empresa: number;
	id_user: number;
	objSend: object;
	
	g: any;
	load: any;
	company: string;
	title: string;
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public storage: Storage, public plt: Platform, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics){
		this.g = new Global();
		this.title = this.navParams.get('title');
		this.id_user = this.navParams.get('id_user');
		this.empresa  = this.navParams.get('empresa');
		this.passType = this.navParams.get('tipo_senha');

		this.focus = 'currentPass';

		console.log(this.title);
		this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
			this.company = value;
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

	passwordChange(){
		this.objSend = {
  		procedimento: 49,
  		p_empresa: this.empresa,
  		p_id_user: this.id_user,
  		p_senha_atual: this.currentPass,
  		p_senha_nova: this.confirmNewPass,
  		p_tipo_senha: this.passType
  	}
  	this.apiPasswordChange(this.g.urlApi, this.objSend);
	}

	//requisicoes
  apiPasswordChange(url, arraySend){
    let body = JSON.stringify(arraySend);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        if(data.message == 'Sucesso'){
	        if(data.result[0]['r_status'] == 1){
	        	this.toast(data.result[0]['r_mensagem'], '3000', 'top', 'success');
	        	setTimeout(() => this.navCtrl.pop(), 1000);
	        }else{
	        	this.clearFields();
	        	this.toast(data.result[0]['r_mensagem'], '3000', 'top', 'error');
	        }
        }else{
          this.newPass = '';
          this.toast('Dados incorretos', '3500', 'top', 'error');
        }
      },  
      err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => this.load.dismiss() 
    );
  }

  confirmPassChange(){
  	let alert = this.alertCtrl.create({
	    title: 'Confirmação',
	    message: 'Deseja alterar a senha do seu cartão?',
	    buttons: [
	      {
	        text: 'Cancelar',
	        role: 'cancel',
	        handler: () => {
	          this.navCtrl.pop();
	        }
	      },
	      {
	        text: 'Confirmar',
	        handler: () => {
	          this.passwordChange();
	        }
	      }
	    ]
	  });
	  alert.present();	
	}

	validates(){
    if(this.currentPass.length == 0){
  		this.toast("O campo 'Senha Atual', deve ser preenchido" , '1500', 'top', 'error');
  	}else if(this.newPass.length == 0){
  		this.toast("O campo 'Nova Senha', deve ser preenchido" , '1500', 'top', 'error');
  	}else if(this.confirmNewPass.length == 0){
	 		this.toast("O campo 'Confirmar Nova Senha', deve ser preenchido" , '1500', 'top', 'error');
  	}else{
	 		if(this.newPass != this.confirmNewPass){
				this.toast("As senhas não coencidem" , '1500', 'top', 'error');
 			}else{
  			this.confirmPassChange();			
	  	}
	  }
	}

	clearFields(){
		this.currentPass = '';
  	this.newPass = '';
  	this.confirmNewPass = '';
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