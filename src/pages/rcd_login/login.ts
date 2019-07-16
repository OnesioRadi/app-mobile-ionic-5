import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http } from '@angular/http';
import { MenuPrincipalPage } from '../rcd_menu-principal/menu-principal';
//import { Http, Headers, RequestOptions } from '@angular/http';
//import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	g: any;
	load: any;
  company: number;
  titlePage: string;
  cnpjCpf: string;
	neu: string;
	disabledButton: boolean = false;
	loginRCRemember: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public translateService: TranslateService, public storage: Storage, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics){
    this.g = new Global();

    this.cnpjCpf = "";
		this.neu = "";
		this.loginRCRemember = true;

    this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    })
    this.translateService.get('PG_LOGIN-TITULO').subscribe((value) => {
      this.titlePage = value;
		})
		
		this.typeLogin();

    plt.ready().then(() => {
      /*Google Analytics*/
      this.ga.startTrackerWithId(this.g.codeGA)
      .then(() => {
      this.ga.trackView(this.company + '/' + this.titlePage);
      })
      .catch(e => console.log('Erro ao iniciar Google Analytics', e));
      });
	}
	
	emptyField(){
		if(this.cnpjCpf.length == 14 || this.cnpjCpf.length == 18){
			if(this.neu.length > 0){
				this.disabledButton = null;
			}
		}else{
			this.disabledButton = false;
		}		
	}

	neuCheck(){
		this.emptyField();
	}

	maskInput(ev){
		this.emptyField();  

		if(this.cnpjCpf.length < 15 ){
			//cpf
			ev.target.value = ev.target.value.replace(/\D/g,"");                    
			ev.target.value = ev.target.value.replace(/(\d{3})(\d)/,"$1.$2");       
			ev.target.value = ev.target.value.replace(/(\d{3})(\d)/,"$1.$2");       
			ev.target.value = ev.target.value.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
		}else{  
			//cnpj
			ev.target.value = ev.target.value.replace(/\D/g,"");                    
			ev.target.value = ev.target.value.replace(/^(\d{2})(\d)/,"$1.$2");     
			ev.target.value = ev.target.value.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3"); 
			ev.target.value = ev.target.value.replace(/\.(\d{3})(\d)/,".$1/$2");
			ev.target.value = ev.target.value.replace(/(\d{4})(\d)/,"$1-$2");
		}   
		//console.log(this.cnpj.length);
	}

  maskRemove(cnpj){
		let newCnpj = cnpj.replace(/\D/g,'');
		return newCnpj;
	}

  loginRememberVerify(){		
		//console.log(this.lembrarLogin);
		if(this.loginRCRemember == true){		
			localStorage.setItem('rcLoginRemember', 'true');
			localStorage.setItem('rcCnpj', this.cnpjCpf);
			localStorage.setItem('rcNeu', this.neu);		
		}else{
			localStorage.setItem('rcLoginRemember', 'false');
			localStorage.setItem('rcCnpj', this.cnpjCpf);
			localStorage.setItem('rcNeu', this.neu);		
		}	

    console.log('Local Storage',localStorage.getItem('rcNeu'));

		
	/*	if(this.loginRCRemember == true){		
			localStorage.setItem('rcLoginRemember', 'true');
			localStorage.setItem('rcCnpj', this.cnpjCpf);
			localStorage.setItem('rcNeu', this.neu);		
		}else{
			localStorage.setItem('rcLoginRemember', 'true');
			localStorage.removeItem('rcCnpj');
			localStorage.removeItem('rcNeu');
		}			
		*/
	}	

	typeLogin(){
		if(localStorage.getItem('rcLoginRemember') == 'true'){
			this.cnpjCpf = localStorage.getItem('rcCnpj'); 
			this.neu = localStorage.getItem('rcNeu');
			this.disabledButton = null;
		}
	}

	login(){			
		console.log('loginRCRemember',this.loginRCRemember);
		this.apiMerchantLogin(this.maskRemove(this.cnpjCpf), this.neu);
		//this.consomeInfoEstabelecimento(48, this.cnpj, this.neu);
	}
	
	
	goToMainMenu(){
		this.navCtrl.push(MenuPrincipalPage);
	}		


	//api
	apiMerchantLogin(cnpj, neu){
		this.loading('Logando...');

		let url = "https://api-pos.orgcard.com.br/v1/logon?3=920000&42=" + cnpj + "&52=" + neu;
		
		this.http.get(url)
		.map(res => res.json())
		.subscribe(
			data =>{
				if(data['0810']['62'] == 'Sucesso'){		
					localStorage.setItem('merchantName', data['0810']['63.2']);
					this.loginRememberVerify(); 
					this.goToMainMenu();
				}else{
					//this.load.dismiss();
					this.toast(data['0810']['62'] , '1500', 'top', 'error');					
				}
			},    
			err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
			() => this.load.dismiss()
		);	
	}
			
			
	/* consomeInfoEstabelecimento(procedimento, cnpj, neu){
			
			
								let body = JSON.stringify({procedimento: procedimento, cnpj: cnpj, neu: neu});
								let headers = new Headers({ 'Content-Type': 'application/json' });
								let options = new RequestOptions({ headers: headers });
							
								let url = this.endPointApi;
								this.http.post(url, body, options)
									.map(res => res.json())
									.subscribe(
											data =>{
			
											 //verifica retorno da api
												if(data.message == 'Sucesso'){
													 
														this.info = data.result[0];
														localStorage.setItem('idRedeCredenciada', this.info['id_rede_credenciada']);
														//localStorage.setItem('empresaRedeCredenciada', this.info['empresa']);
														localStorage.setItem('empresaRedeCredenciada', this.idEmpresa);
														
			
												}else{
			
														this.alerta("Erro", "Não foi possível retornar as informações do estabelecimento");
														this.nav.push(MenuPrincipalRedeCredenciadaPage);
												}
											},  
											err => { console.log(err); this.alerta("Erro", "Servidor indisponível, por favor tente novamente mais tarde"); },
											() => console.log('Consumiu Info do Estabelecimento') 
							);
					}*/	

	//Components
	loading(title){
    this.load = this.loadingCtrl.create({
      content: '<h5>'+title+'</h5>',
    });
    this.load.present();
	}					
	
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
