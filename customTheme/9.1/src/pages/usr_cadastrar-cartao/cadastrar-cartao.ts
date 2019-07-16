import { Component, ViewChild, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Global } from '../../global/global';
import { SenhaCartaoPage } from '../usr_senha-cartao/senha-cartao';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';

@IonicPage()
@Component({
  selector: 'page-cadastrar-cartao',
  templateUrl: 'cadastrar-cartao.html',
})

export class CadastrarCartaoPage implements OnInit {
  @ViewChild(IonDigitKeyboardCmp) keyboard;

  g: any;
  load: any;
  saveCard: boolean;
  saveCpf: boolean;
  segmentTab: any;
  idEmpresa: any;
  titlePage: string;
  focus: string = '';
  cardNumber: string = '';
  cpfNumber: string = '';
  passwordType: string;

  numberCardRecover: string = '';
  cpfRecover: string = '';
  dateRecover: string = '';
  newPassRecover: string = '';
  confirmNewPassRecover: string = '';
  company: string;

  public keyboardSettings: IonDigitKeyboardOptions = {
      align: 'center',
      //width: '85%',
      visible: true,
      leftActionOptions: {
          iconName: 'ios-backspace-outline',
          fontSize: '1.4em'
      },
      rightActionOptions: {
          iconName: 'ios-checkmark-circle-outline',
          text: '.',
          fontSize: '1.3em'
      },
      roundButtons: false,
      showLetters: false,
      swipeToHide: true,
      // Available themes: IonDigitKeyboard.themes
      theme: 'ionic'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public translateService: TranslateService, public storage: Storage, public plt: Platform, public vibration: Vibration, private ga: GoogleAnalytics){
    this.g = new Global();
    //segment
    this.segmentTab = 'cartao';
    //botoes
    this.saveCard = true;
    this.saveCpf = true;
    //titulo da pagina
    this.titlePage = 'Entrar com cartão';
	  this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
      this.company = value;
    });
    this.translateService.get('CG_EMPRESA').subscribe((value) => {
      this.idEmpresa = value;
    });
    this.translateService.get('CG_TIPO_SENHA_LOGIN').subscribe((value) => {
      this.passwordType = value;
    });

    //foco campo inicial
    //this.focus ='cardNumber';

  	plt.ready().then(() => {
        /*Google Analytics*/
  	  this.ga.startTrackerWithId(this.g.codeGA)
  	  .then(() => {
  		  this.ga.trackView(this.company + '/' + this.titlePage);
  	  })
  	  .catch(e => console.log('Erro ao iniciar Google Analytics', e));
      });
  }

  ionViewDidEnter(){      
    switch(this.segmentTab){
      case 'cartao':
        this.focus = 'cardNumber';
        break;
      case 'cpf':
        this.focus = 'cpfNumber';
        break;
    }   
    this.keyboard.show();
  }

  //submit o form
  registerCard(){
    this.apiValidateCard(this.g.urlPos, this.g.removeSpace(this.cardNumber));
  }

  registerCpf(){
    this.validateCpf(this.cpfNumber);
  }

  apiValidateCard(url, cardNumber){
    this.keyboard.hide();
    let newUrl = url + '/validacartao?2=' + cardNumber;
    console.log(newUrl);
    this.http.get(newUrl)    
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        let arr = Object.keys(data).map(function(k) { return data[k] });
        if((arr[0][39] == '00') || (arr[0][39] == '08')){
          this.storage.set('saveCard', this.saveCard);          
          this.navCtrl.push(SenhaCartaoPage, {
            cardNumber: cardNumber
          });
        }else{
          this.keyboard.show();
          this.focus ='cardNumber';
          this.toast(arr[0][62], '2500', 'top', 'error');
        }
      },
      err => { this.load.dismiss(); this.keyboard.show(); this.focus ='cardNumber'; this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => this.load.dismiss()
    );
  }
  apiPassRecover(url, arraySend){
    let body = JSON.stringify(arraySend);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(url, body, options)
    .map(res => res.json(), this.loading('Carregando...'))
      .subscribe(
      data =>{
        if(data.message == 'Sucesso'){

          //console.log(data);
          //if(data.result[0]){
          //}
          this.toast('Senha atualizada com sucesso', '2500', 'top', 'success');
          this.navCtrl.pop();

        }else{
          this.toast('Não foi possível recuperar sua senha', '3500', 'top', 'error');
        }
      },
      err => { this.load.dismiss(); this.toast('Sistema temporariamente indisponível por favor tente novamente mais tarde', '4500', 'top', 'notice'); console.log(err) },
      () => this.load.dismiss()
    );
  }

  recoverPass(){
    if(this.numberCardRecover.length < 19 ){
      this.toast('Cartão inválido', '3000', 'top', 'error');
    }else if(this.cpfRecover.length < 14){
      this.toast('CPF inválido', '3000', 'top', 'error');
    }else if(this.dateRecover.length == null){
      this.toast('Data de nascimento inválida', '3000', 'top', 'error');
    }else if(this.newPassRecover.length < 6){
      this.toast('A nova senha deve conter 6 números', '3000', 'top', 'error');
    }else if(this.confirmNewPassRecover.length < 6){
      this.toast('A confirmação da senha deve conter 6 números', '3000', 'top', 'error');
    }else if(this.newPassRecover != this.confirmNewPassRecover){
      this.toast('A nova senha e confirmação da senha devem ser indenticas', '3500', 'top', 'error');
    }else{
      this.apiPassRecover(this.g.urlApi, { procedimento: 60, p_empresa: this.idEmpresa, p_numero_cartao: this.numberCardRecover, p_cpf: this.cpfRecover, p_data_nasc: this.dateRecover, p_nova_senha: this.newPassRecover, p_tipo_senha: this.passwordType });
    }
  }

  validateCpf(cpfNumber){
    if(cpfNumber.length == 14){
      this.storage.set('saveCpf', this.saveCpf);
      this.navCtrl.push(SenhaCartaoPage,{
        cpfNumber: this.g.removeMask(cpfNumber)
      });
    }else{
      this.toast('CPF inválido', '2500', 'top', 'error');
    }
  }

  //mascaras
  maskCard(){
    let newCard = this.cardNumber;
    newCard = newCard.split(" ").join("");
    if(newCard.length < 16){
      if (newCard.length > 0) {
        newCard = newCard.match(new RegExp('.{1,4}', 'g')).join(" ");
      }
    }else{
      newCard = [newCard.slice(0, 6), ' ', newCard.slice(6)].join('');
      newCard = [newCard.slice(0, 11), ' ', newCard.slice(11)].join('');
      newCard = [newCard.slice(0, 16), ' ', newCard.slice(16)].join('');
    }
    if (newCard.length > 20){
      newCard = newCard.slice(0, -1);
    }
    this.cardNumber = newCard;
  }
  
  maskCpf(cpf){
    let newCpf = cpf;
    newCpf = newCpf.replace(/\D/g,"");
    newCpf = newCpf.replace(/(\d{3})(\d)/,"$1.$2");
    newCpf = newCpf.replace(/(\d{3})(\d)/,"$1.$2");
    newCpf = newCpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
    if (newCpf.length > 13){
      newCpf = newCpf.slice(0, -1);
    }
    return newCpf;
  }

  cardFormat(ev){                         
    let newCard = ev.target.value.split(" ").join(""); 
    if(ev.target.value.length < 20){         
      if (newCard.length > 0) {
        newCard = newCard.match(new RegExp('.{1,4}', 'g')).join(" ");
      }
    }else{
      newCard = [newCard.slice(0, 6), ' ', newCard.slice(6)].join('');
      newCard = [newCard.slice(0, 11), ' ', newCard.slice(11)].join('');
      newCard = [newCard.slice(0, 16), ' ', newCard.slice(16)].join('');
    }    
    ev.target.value = newCard;                   
  }

  cpfFormat(ev){
    ev.target.value = this.maskCpf(ev.target.value);    
  }

  //segments
  segmentChanged(event, item){
      switch(item){
        case 'cartao':
          this.segmentTab = 'cartao';
          this.titlePage = 'Entrar com cartão';
          this.keyboard.show();
          this.focus = 'cardNumber';
          this.cpfNumber = '';
        break;
        case 'cpf':
          this.segmentTab = 'cpf';
          this.titlePage = 'Entrar com CPF';
          this.keyboard.show();
          this.focus = 'cpfNumber';
          this.cardNumber = ''
        break;
        case 'esqueciSenha':
          this.segmentTab = 'esqueciSenha';
          this.keyboard.hide();
          this.titlePage = 'Esqueci minha senha';
          this.cardNumber = '';
          this.cpfNumber = '';
        break;
      }
  }
  clear(){
    //this.vibration.vibrate(50);
    if(this.focus == 'cardNumber'){
      this.cardNumber = '';
    }else{
      this.cpfNumber = '';
    }
  }
  //loading
  loading(title){
    this.load = this.loadingCtrl.create({
      content: '<h5>'+title+'</h5>',
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
  
  //Keyboard
  ngOnInit(): void {
    this.keyboard.onClick.subscribe((key: any) => {
      let field = this.focus;
      //this.vibration.vibrate(50);
      if (typeof key == 'number') {
        if(field == 'cardNumber'){
          this.maskCard();
        }else{
          this.cpfNumber = this.maskCpf(this.cpfNumber);
        }
        this[field] += key;
      } else {
        if (key == 'left') this[field] = this[field].substring(0, this[field].length - 1);
        if (key == 'right'){
          if(field == 'cardNumber'){
            this.registerCard();
          }else{
            this.registerCpf();
          }
        }
      }
    });
    this.keyboard.onHide.subscribe(() => {
        this.focus = '';
    });
  }
  setFocus(field: string) {
    this.focus = field;
    this.keyboard.show();
  }
  //Keyboard
}