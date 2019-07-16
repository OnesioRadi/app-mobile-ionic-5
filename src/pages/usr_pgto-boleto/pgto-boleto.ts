import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BarcodeValidatesProvider } from '../../providers/barcode-validates/barcode-validates';



@IonicPage()
@Component({
  selector: 'page-pgto-boleto',
  templateUrl: 'pgto-boleto.html',
})
export class PgtoBoletoPage {
  options: {};
  ticketInfo: Object;
  firstPart: String = "";
  secondPart: String = "";
  thirdPart: String = "";
  fourthPart: String = "";
  expDate: Date;
  ticketInfoHidden: boolean;
  calcModule: Number = 0;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public barcodeValidates: BarcodeValidatesProvider, private toastCtrl: ToastController) {
    this.options = {
      orientation: 'landscape'
    }
    this.ticketInfoHidden = true;
    this.ticketInfo = new Object( {
      ticketValue: 0,
      segment: ""
    }); 
  }

  clear(elem){
    this.ticketInfo = {};
    this.firstPart = "";
    this.secondPart = "";
    this.thirdPart = "";
    this.fourthPart = "";
    this.expDate = null;
    this.ticketInfoHidden = true;
    if(elem){
      elem.setFocus();
    }
    
  }

  scan(){
    this.barcodeScanner.scan(this.options).then(barcodeData => {    
      this.ticketInfo = this.barcodeValidates.barcodeGetValues(barcodeData.text);      
      this.firstPart = this.ticketInfo['barcodeArray'][0];
      this.secondPart = this.ticketInfo['barcodeArray'][1];
      this.thirdPart = this.ticketInfo['barcodeArray'][2];
      this.fourthPart = this.ticketInfo['barcodeArray'][3];      
      this.ticketInfoHidden = false;
    }).catch(err => {
      this.toast('Não foi possível iniciar a leitura do cód. barras do boleto', '3500', 'top', 'error');
    });
  }

  getCalcModule(ev){    
    this.calcModule = parseInt(ev.target.value.substr(2,1));
    console.log(this.calcModule);
  }

  barcodeMask(ev, barcodePart, nextElement){     
    let barcode = ev.target.value;

    if(barcodePart == 1){
      if(barcode[2]){
        this.calcModule = barcode[2];
        console.log(this.calcModule);
      }      
    }


    if(barcode.length > 12){     
      barcode = barcode.replace('-', '');            
    }
    if(barcode.length == 12){      
      ev.target.blur();
      if(nextElement){
        nextElement.setFocus();
      }
    }
    ev.target.value = barcode.replace(/^(\d{11})(\d{1})/g, "$1-$2");                        

   
  }

  barcodeCheck(){
    let part1, part2, part3, part4;     
    let barcode = "";

    part1 = this.firstPart.substr(0, 11);
    part2 = this.secondPart.substr(0, 11);
    part3 = this.thirdPart.substr(0, 11);
    part4 = this.fourthPart.substr(0, 11);

    barcode = part1 + part2 + part3 + part4;

    this.ticketInfo = this.barcodeValidates.barcodeGetValues(barcode);
    this.ticketInfoHidden = false;    
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
