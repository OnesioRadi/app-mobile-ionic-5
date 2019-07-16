	import { Component } from '@angular/core';
	import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, Platform } from 'ionic-angular';
	import { Global } from '../../global/global';
	import { TranslateService } from '@ngx-translate/core';
	import { Vibration } from '@ionic-native/vibration';
	import { GoogleAnalytics } from '@ionic-native/google-analytics';
	import { Display } from '../../display/display';
	import { ExtratoPage } from '../usr_extrato/extrato';
	import { BloquearCartaoPage } from '../usr_bloquear-cartao/bloquear-cartao';
	import { PgtoBoletoPage } from '../usr_pgto-boleto/pgto-boleto';	
	import { AlterarSenhaPage } from '../usr_alterar-senha/alterar-senha';
	import { TransferenciaCartaoDestinoPage } from '../usr_transferencia-cartao-destino/transferencia-cartao-destino';
 	import { Http, Headers, RequestOptions } from '@angular/http';
	import 'rxjs/add/operator/map';
	
	@IonicPage()
	@Component({
		selector: 'page-detalhe-cartao',
		templateUrl: 'detalhe-cartao.html',
	})
	export class DetalheCartaoPage {

		balance:any;
		load:any;
		d: Object;
		g:any;
		limit:any;
		qtdMaxPlot:any;
		percMaxPlot:any;
		balancePlot:any;
		card:object;
		spinnerBalance:boolean;
		spinnerDataCard:boolean;
		spinnerBalancePlot:boolean;
		company: string;
		title: string;

		constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public viewCtrl: ViewController, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, private ga: GoogleAnalytics, public translateService: TranslateService, public vibration: Vibration) {
			//constantes
			this.g = new Global();
			this.d = new Display();
		
			this.card = navParams.get('dataCard');
			console.log(this.card);
			
			//metodos load
			this.loadBalance();

			this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
					this.company = value;
				})
			this.translateService.get('PG_DETALHE-CARTAO_TITULO').subscribe((value) => {
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
		}

		closeModal(){
			this.viewCtrl.dismiss();
		}

		goToStatement(){
			//this.vibration.vibrate(50);
			this.navCtrl.push(ExtratoPage, {
				id_ac_usuario: this.card['r_id_usuario'],
				id_usuario_cartao: this.card['r_id_usuario_cartao'],
				card_number: this.card['r_numero_cartao'] 
		 	});
		}

		loadBalance(){
			let dataUser = {
			 procedimento: 35,
			 id_ac_usuario_cartao: this.card['r_id_usuario_cartao'],
			 tipo_periodo: 1
		 }
		 this.apiBalance(this.g.urlApi, dataUser);
		 
		}

		//requisicoes
		apiBalance(url, arraySend){
			let body = JSON.stringify(arraySend);
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });			
			this.http.post(url, body, options)
			.map(res => res.json(), this.spinnerBalance = false)
				.subscribe(
				data =>{					
					if(data.message == 'Sucesso'){
						this.balance = data.result[0]['saldo_disponivel'];
					}else{
						this.toast('Erro ao carregar o saldo', '3500', 'top', 'error');
					}
				},
				err => { this.spinnerBalance = true; this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
				() => { this.spinnerBalance = true; this.apiDataCard(this.g.urlApi, { procedimento: 36, p_id_ac_usuario_cartao: this.card['r_id_usuario_cartao'] }) }
			);
		}
		apiDataCard(url, arraySend){
			let body = JSON.stringify(arraySend);
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });
			this.http.post(url, body, options)
			.map(res => res.json(), this.spinnerDataCard = false)
				.subscribe(
				data =>{
					if(data.message == 'Sucesso'){
						this.limit = data.result[0]['r_limite_compra'];
						this.qtdMaxPlot = data.result[0]['r_maximo_parcelas'];
						this.percMaxPlot = data.result[0]['r_perc_limite_parcelamento'];
					}else{
						this.toast('Erro ao carregar o limite', '3500', 'top', 'error');
					}
				},
				err => { this.spinnerDataCard = true; this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
				() => { this.spinnerDataCard = true; /*this.apiBalancePlot(this.g.urlApi, {procedimento: 44, p_id_ac_usuario_cartao: this.card['r_id_usuario_cartao'] , p_tipo_periodo: 1})*/ }
			);
		}

		apiBalancePlot(url, arraySend){
			let body = JSON.stringify(arraySend);
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });
			this.http.post(url, body, options)
			.map(res => res.json(), this.spinnerBalancePlot = false)
				.subscribe(
				data =>{
					if(data.message == 'Sucesso'){
						this.balancePlot = data.result[0]['r_saldo_parcelado'];
					}else{
						this.toast('Erro ao carregar o saldo parcelado', '3500', 'top', 'error');
					}
				},
				err => { this.spinnerBalancePlot = true; this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
				() => this.spinnerBalancePlot = true
			);
		}

		goToCardBlock(title){
			//this.vibration.vibrate(50);
			this.navCtrl.push(BloquearCartaoPage, {
				title: title,
				cardNumber: this.card['r_numero_cartao']
			});
		}

		goToBarcodeScanner(){
			//this.vibration.vibrate(50);
			this.navCtrl.push(PgtoBoletoPage);
		}

		goToPasswordChange(passType){
			let id_user = 0;
			let pageTitle = '';
			if (passType == 'U'){
				id_user = this.card['r_id_usuario'];
				pageTitle = 'Alterar senha do site';
			}else{
				id_user = this.card['r_id_usuario_cartao'];
				pageTitle = 'Alterar senha do cartão';
			}

			//this.vibration.vibrate(50);
			this.navCtrl.push(AlterarSenhaPage, {
				title: pageTitle,
				empresa: this.card['r_empresa'],
				tipo_senha: passType,
				id_user: id_user
			});
		}

		goToTransferDestinyCard(){
			//this.vibration.vibrate(50);

			this.navCtrl.push(TransferenciaCartaoDestinoPage, {
				fromCard: this.card['r_numero_cartao']
			});
		}


		//Componentes
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
