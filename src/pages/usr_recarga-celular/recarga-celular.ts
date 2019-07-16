import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Platform, Alert } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import CryptoJs from 'crypto-js';
import { RecargaComprovantePage } from '../usr_recarga-comprovante/recarga-comprovante';

@IonicPage()
@Component({
	selector: 'page-recarga-celular',
	templateUrl: 'recarga-celular.html',
})

export class RecargaCelularPage {
	passType: string;
	currentPass: string;
	newPass: string;
	newPhone: string;
	confirmPhone: string;
	OperadoraSelecionado: string;
	ValorSelecionado: number;
	InfoTelecomApi: Array<object>;
	focus: string = '';
	empresa: number;
	id_user: number;
	objSend: object;
	arraySend: object;
	g: any;
	load: any;
	company: string;
	title: string;
	url_api_008: string;
	url_api_portal: string;
	pass_key: string;
	return_telecom: Array<{ produto: string, tipo: string, fornecedor: string }>;
	return_telecom_valor: Array<object>;
	hideButtoncharger: boolean;
	hideSelecTelecomValor: boolean;
	cardNumber: string;
	cardSenha: string;
	r_data_hora_confirmacao: string;
	r_numero_recarga: number;
	r_valor_taxa: number;	
	cardNome: string;

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public storage: Storage, public plt: Platform, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics) {
		this.g = new Global();
		this.title = this.navParams.get('title');
		this.id_user = this.navParams.get('id_user');
		this.empresa = this.navParams.get('empresa');
		this.passType = this.navParams.get('tipo_senha');
		this.cardNumber = this.navParams.get('cardNumber');
		this.cardNome = this.navParams.get('cardNome');
		console.log('to aqui', this.cardNome);
		this.cardSenha = this.navParams.get('cardSenha');
		this.url_api_008 = 'https://recarga.008cards.com.br/api/v1/';
		this.url_api_portal = 'https://portal.orgcard.com.br/008cards/api008_recarga.php';
		this.hideButtoncharger = true;
		this.hideSelecTelecomValor = true;
		this.focus = 'currentPass';
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

	ionViewDidEnter() {
		this.apiTelecom();
	}

	SelecTelecom(OperadoraSelecionado: string) {
		this.apiTelecomValor(OperadoraSelecionado);
		this.hideSelecTelecomValor = false;
	}

	SelecTelecomValor() {
		this.hideButtoncharger = false;
	}

	//Busca Dados das Operadoras Diposniveis 
	apiTelecom() {
		let newUrl = `${this.url_api_008}produtos`;
		let headers = new Headers({ "cache-control": "no-cache" });
		let options = new RequestOptions({ headers: headers });
		this.http.get(newUrl)
			.map(res => res.json(), this.loading('Carregando...'))
			.subscribe(
				data => {
					if (data.status == "OK") {
						this.return_telecom = data.result;
					}
					else {
						this.toast('Api da operadora fora do ar! Tente novamente mais tarde.', '4500', 'top', 'notice');
					}
				},
				err => {
					this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice');
					console.log(err)
				},
				() => this.load.dismiss()
			)
	}

	//Busca Valores de recarga de acordo com aperadora informada 	
	apiTelecomValor(OperadoraSelecionado) {
		let newUrl = `${this.url_api_008}produto/valores?produto=${OperadoraSelecionado}`;
		this.http.get(newUrl)
			.map(res => res.json(), this.loading('Carregando...'))
			.subscribe(
				data => {

					if (data.status == "OK") {
						this.return_telecom_valor = data.result;
					}
					else {
						this.toast('Api da operadora fora do ar! Tente novamente mais tarde.', '4500', 'top', 'notice');
					}
				},
				err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
				() => this.load.dismiss()
			)
	}

	recargaCelular() {
		if (this.newPhone !== '' && this.confirmPhone !== '') {
			if (this.newPhone === this.confirmPhone) {
				const filterTelecom = this.return_telecom.filter((item, i) => {
					return item.produto === this.OperadoraSelecionado;
				});

				try {
					this.apiRecarga(this.g.urlApi, { procedimento: 65, p_empresa: this.empresa, p_numero_cartao: this.cardNumber, p_senha: this.cardSenha, p_operadora: filterTelecom[0].fornecedor, p_tipo_produto: filterTelecom[0].tipo, p_produto: filterTelecom[0].produto, p_telefone: this.newPhone, p_valor: this.ValorSelecionado / 100 }, filterTelecom);
				} catch (error) {
					console.log(error);
					this.toast('Api da operadora fora do ar! Tente novamente mais tarde.', '4500', 'top', 'notice');
				}
				//this.apiRecargaChange(this.objSend);
			}
			else {
				this.toast('Numero de celulares diferentes! Verifique', '4500', 'top', 'notice');
			}
		} else {
			this.toast('Digite um número de celular válido', '4500', 'top', 'notice');

		}
	}

	apiRecarga(url, arraySend, filterTelecom) {
		let body = JSON.stringify(arraySend);
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let returndata = { r_id_ac_recarga_celular: 0, r_bin: "", r_result_code: 0, r_result_message: "", status: "" };
		this.http.post(url, body, options)
			.map(res => res.json())
			.subscribe(
				data => {
					if (data.message == 'Sucesso') {
						returndata = {
							r_id_ac_recarga_celular: data.result[0].r_id_ac_recarga_celular,
							r_bin: data.result[0]['r_bin'],
							r_result_code: data.result[0]['r_result_code'],
							r_result_message: data.result[0]['r_result_message'],
							status: data.message
						}
						this.api008CardsRecarga(returndata, filterTelecom);
					} else {

						this.toast('Erro ao realizar a recarga', '3500', 'top', 'error');
					}
				},
				err => { this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err); },
				() => console.log('')
			);

	}



	api008CardsRecarga(returndata, filterTelecom) {
		this.pass_key = `${filterTelecom[0].produto}${filterTelecom[0].tipo}${filterTelecom[0].fornecedor}${this.newPhone}${this.ValorSelecionado}${returndata['r_bin']}${returndata.r_id_ac_recarga_celular}${this.ValorSelecionado}`;
		//console.log(this.pass_key);
		const hash = CryptoJs.HmacSHA256(this.pass_key, "orgcard");
		const passkey = hash.toString(CryptoJs.enc.Base64);
		//alert(hash.toString(CryptoJs.enc.Latin1)); 		
		if (returndata.r_result_code === 111) {
			let objSend = {
				basic: passkey,
				Produto: filterTelecom[0].produto,
				Tipo: filterTelecom[0].tipo,
				Fornecedor: filterTelecom[0].fornecedor,
				Telefone: this.newPhone,
				Valor: this.ValorSelecionado,
				Bin: returndata.r_bin,
				Autorizacao: returndata.r_id_ac_recarga_celular,
				Debito: this.ValorSelecionado
			}
			this.apiRecargaChange(objSend, passkey);

		} else {
			this.toast(returndata.r_result_message, '4500', 'top', 'notice');
		}
	}

	//requisicoes
	apiRecargaChange(objSend, passkey) {
		let newUrl = `${this.url_api_008}recarga/`;
		let body = `Autorizacao=${objSend.Autorizacao}&Debito=${objSend.Debito}&Fornecedor=${objSend.Fornecedor}&Produto=${objSend.Produto}&Telefone=${objSend.Telefone}&Tipo=${objSend.Tipo}&Valor=${objSend.Valor}&basic=${encodeURIComponent(passkey)}&bin=${objSend.Bin}`;
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(newUrl, body, options)
			.map(res => res.json(), this.loading('Carregando...'))
			.subscribe(
				data => {
					if (data.status === 'OK') {
						this.apiGravaRetorno(this.g.urlApi, { procedimento: 66, p_empresa: this.empresa, p_id_ac_recarga_celular: objSend.Autorizacao, p_autorizacao_operadora: data.result[0].mensagem, p_status_operadora: data.result[0].status, p_nsu_operadora: data.result[0].nsu, p_mensagem_operadora: data.result[0].mensagem, p_validade: data.result[0].validade, p_tipo: 200 }, objSend);

					} else {
						alert('Falha no autorizador da recarga');
					}
				},
				err => { this.load.dismiss(); this.toast('01 - Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
				() => this.load.dismiss()
			);
	}



	/* API PARA GRAVAR DADOS DE RETORNO */
	apiGravaRetorno(url, arraySend, objSend) {
		let body = JSON.stringify(arraySend);
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let returndata = { r_result_code: 0, r_result_message: "", r_data_hora_confirmacao: "", r_numero_recarga: "", r_valor_taxa: 0 };
		this.http.post(url, body, options)
			.map(res => res.json())
			.subscribe(
				data => {
					if (data.message == 'Sucesso') {
						returndata = {
							r_result_code: data.result[0]['r_result_code'],
							r_result_message: data.result[0]['r_result_message'],
							r_data_hora_confirmacao: data.result[0]['r_data_hora_confirmacao'],
							r_numero_recarga: data.result[0]['r_numero_recarga'],
							r_valor_taxa: data.result[0]['r_valor_taxa']
						}

						this.goToTicket(objSend, arraySend, returndata.r_data_hora_confirmacao, this.cardNome,returndata.r_numero_recarga,returndata.r_valor_taxa);
					} else {

						this.toast('Erro ao realizar a recarga', '3500', 'top', 'error');
					}
				},
				err => { this.toast('02 - Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err); },
				() => console.log('')
			);
	}

	goToTicket(objSend, arraySend, r_data_hora_confirmacao, cardNome,r_numero_recarga,r_valor_taxa) {
		console.log('toque=>', objSend);
		console.log('toque=>', r_valor_taxa);
		this.navCtrl.push(RecargaComprovantePage, {
			objSend: objSend,
			arraySend: arraySend,
			r_data_hora_confirmacao: r_data_hora_confirmacao,
			cardNome: cardNome,
			r_numero_recarga: r_numero_recarga,
			r_valor_taxa: r_valor_taxa

		});
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