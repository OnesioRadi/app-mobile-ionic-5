import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Platform, Alert } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Global } from '../../global/global';
import { Http, Headers, RequestOptions } from '@angular/http';
import { EnviarComprovantePage } from '../rcd_enviar-comprovante/enviar-comprovante';
import { CarteiraPage } from '../usr_carteira/carteira';
import 'rxjs/add/operator/map';
import { ExtratoPage } from '../usr_extrato/extrato';

@IonicPage()
@Component({
	selector: 'page-recarga-comprovante',
	templateUrl: 'recarga-comprovante.html',
})

export class RecargaComprovantePage {
	pageTitle: string;
	currentPass: string;
	newPass: string;
	newPhone: string;
	confirmPhone: string;
	OperadoraSelecionado: string;
	ValorSelecionado: number;
	InfoTelecomApi: Array<object>;
	focus: string = '';

	objSend: object;
	arraySend: object;
	g: any;
	load: any;
	company: string;
	title: string;
	pass_key: string;
	hideButtoncharger: boolean;

	ticketTop: string;
	ticketBottom: string;
	agree: boolean;
	degree: boolean;
	situationIcon: string;
	situation: string;
	respMsg: string;
	authCode: string;
	printCoupon: string;
	mailCoupon: string;
	smsCoupon: string;
	pageCount: number;
	respCod: string;

	p_autorizacao_operadora: string;
	p_empresa: number;
	p_mensagem_operadora: string;
	p_nsu_operadora: string;
	p_status_operadora: string;
	p_tipo: number;
	p_validade: string;

	produto: string;
	tipo: string;
	fornecedor: string;
	telefone: string;
	valor: number;
	bin: string;
	autorizacao: number;
	debito: number;
	id_user: number;
	cardNumber: string;
	cardSenha: string;
	p_id_ac_recarga_celular: number;
	r_data_hora_confirmacao: string;
	r_numero_recarga: number;
	r_valor_taxa: number;
	cardNome: string;
	data: string;
	hora: string;

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public storage: Storage, public plt: Platform, public translateService: TranslateService, public vibration: Vibration, private ga: GoogleAnalytics) {
		this.g = new Global();
		//Constants
		this.ticketTop = "../assets/img/fundos/topo-cupom.svg";
		this.ticketBottom = "../assets/img/fundos/base-cupom.svg";
		this.agree = true;
		this.degree = true;		
		//parametros recebidos 
		this.objSend = navParams.get("objSend");
		this.arraySend = navParams.get("arraySend");
		this.r_data_hora_confirmacao = navParams.get("r_data_hora_confirmacao");
		this.r_numero_recarga = navParams.get("r_numero_recarga");
		this.r_valor_taxa = navParams.get("r_valor_taxa");		
		this.data = this.r_data_hora_confirmacao.substr(0, 10);
		this.hora = this.r_data_hora_confirmacao.substr(11, 5);				
		this.cardNome = navParams.get('cardNome');
		this.produto = this.objSend['Produto'];
		this.tipo = this.objSend['Tipo'];
		this.fornecedor = this.objSend['Fornecedor'];
		this.telefone = this.objSend['Telefone'];
		this.valor = this.objSend['Valor'] / 100;
		this.bin = this.objSend['Bin'];
		this.autorizacao = this.objSend['Autorizacao'];
		this.debito = this.objSend['Debito'] / 100;

        this.p_id_ac_recarga_celular = this.arraySend['p_id_ac_recarga_celular'];
		this.p_autorizacao_operadora = this.arraySend['p_autorizacao_operadora'];
		this.p_empresa = this.arraySend['p_empresa'];
		this.p_mensagem_operadora = this.arraySend['p_mensagem_operadora'];
		this.p_nsu_operadora = this.arraySend['p_nsu_operadora'];
		this.p_status_operadora = this.arraySend['p_status_operadora'];
		this.p_tipo = this.arraySend['p_tipo'];
		this.p_validade = this.arraySend['p_validade'];
		
		this.respMsg = this.arraySend['p_mensagem_operadora'];
		this.mailCoupon = this.arraySend['p_mensagem_operadora']+'<br>'+'DANILO MARTINS';
		this.title = this.navParams.get('title');
		this.hideButtoncharger = true;
		this.focus = 'currentPass';

		this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
			this.company = value;
		});

		this.situationValidates();

		//titulo da pagina
		this.translateService.get('PG_RECARGA-CELULAR_COMP_RECARGA').subscribe((value) => {
			this.pageTitle = value;
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

	mailSend() {
		this.navCtrl.push(EnviarComprovantePage, {
			pageCount: this.pageCount + 1,
			emailCoupon: this.mailCoupon,
			smsCoupon: this.smsCoupon
		});
	}

	close() {
		this.pageCount++;
		this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));		
	}

	goToCarteira() {
		this.pageCount++;		
		this.navCtrl.push(ExtratoPage, {
			id_ac_usuario: this.id_user,			
			card_number: this.cardNumber
		 });				
	}

	situationValidates() {
		console.log('Dados para Autorizador:', this.arraySend['p_status_operadora']);
		if (this.arraySend['p_status_operadora'] == 'AUTORIZADA') {
			this.situationIcon = "assets/img/icones/aprovada.svg";
			this.situation = "aprovada";
			this.agree = false;
		} else {
			this.situationIcon = "assets/img/icones/reprovada.svg";
			this.situation = "reprovada";
			this.degree = false;
		}
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