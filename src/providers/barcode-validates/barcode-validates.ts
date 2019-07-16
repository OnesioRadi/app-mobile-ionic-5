import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class BarcodeValidatesProvider {
  barcode: string = ""; 
  segmentList: Object;
  ticketInfo: Object = {};  
  calcModule: number = 0;
  dv: number = 0;

  constructor() {    
    this.segmentList = {
      1: 'Prefeituras',
      2: 'Saneamento',
      3: 'Energia Elétrica e Gás',
      4: 'Telecomunicações',
      5: 'Órgãos Governamentais',
      6: 'Carnes e Assemelhados ou demais Empresas / Órgãos que serão identificadas através do CNPJ',
      7: 'Multas de trânsito',
      9: 'Uso exclusivo do banco'
    }
  }

  barcodeGetValues(barcode: string){    
    let segment = '';
    let ticketValue = 0;
    let segmentIdx = parseInt(barcode.substr(1,1));

    segment = this.segmentList[segmentIdx];
    console.log(segment);
    this.ticketInfo['segment'] = segment;

    let value = barcode.substr(4, 9);
    let decimal = barcode.substr(13, 2);
    ticketValue = parseFloat(value+'.'+decimal);
    this.ticketInfo['ticketValue'] = ticketValue;

    this.calcModule = parseInt(barcode.substr(2, 1));
    this.ticketInfo['barcode'] = this.barcodeSplit(barcode, this.calcModule);


    return this.ticketInfo;
    
  }

  barcodeSplit(barcode: String, calcMod: Number){          
    let part = '';
    let barcodeSplit = []
    let barcodeArray = []

    console.log(barcode);
    while(barcode.length > 0){
      part = barcode.substr(0, 11);
      barcode = barcode.substr(11, barcode.length);

      barcodeSplit.push(part);
      console.log(part);
    }

    
    barcodeSplit.forEach(bcode => {
      if(calcMod == 6){
        barcodeArray.push(this.module10(bcode));
        this.barcode += this.module10(bcode);
      } else{

      }
    })
    this.ticketInfo['barcodeArray'] = barcodeArray;
    return this.barcode.trim();
  }

  module10(value: String){
    let valueArray = value.split('');    
    let prod = ''; 
    let mult = 2;   
    let soma = 0;    

    for(let i = valueArray.length - 1; i >= 0; i-- ){               
      prod += (parseInt(valueArray[i]) * mult).toString();      
      
      if (mult == 2 ){
        mult = 1
      } else{
        mult = 2
      }
    }

    prod.split('').forEach( p =>{
      soma += parseInt(p);
    })
        
    this.dv = (soma % 10) > 0 ? 10 - (soma % 10) : 0;
    return value + this.dv.toString();
  }

  module11(value: String){
    let valueArray = value.split('');    
    let prod = 0; 
    let mult = 2;           

    for(let i = valueArray.length - 1; i >= 0; i-- ){               
      prod += parseInt(valueArray[i]) * mult;      
      
      if (mult == 9 ){
        mult = 2;
      } else{
        mult += 1;
      }
    }

    this.dv = prod % 11;

    if ( (this.dv == 0) || (this.dv == 1) ){
      this.dv = 0;
    } else if (this.dv == 10){
      this.dv = 1;
    }          
    return value + this.dv.toString();
  }
}
