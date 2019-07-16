export class Global {  
  urlApi: string;
  urlPos: string;
  codeGA: string;
  constructor() {
    this.urlApi = 'https://api-proc.orgcard.com.br/v2';
    this.urlPos = 'https://api-pos.orgcard.com.br/v1';
	this.codeGA = 'UA-56363336-5';
  }

  insertDot(card){
    card = card.split(' ').join('.');
    return card;
  }
  removeDot(card){
    card = card.split('.').join(' ');
    return card;
  }
  removeDotSpace(card){
    card = card.split('.').join('');
    return card;
  }
  removeSpace(card){
    card = card.split(' ').join('');
    return card;
  }
  removeMask(value){
    value = value.replace(/\D/g,'');
    return value;
  }
  currentDate(){
    let displayDate = new Date();
    return displayDate.toISOString().substring(0, 10);
  }
  onlyNumbers(value){
    value = value.match(/\d/g);
    value = value.join("");
    value = value.replace(/^0+/, '');
    return value; 
  }
  formatPhone(value){
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d\d)(\d)/g, "($1) $2");
    if (value.length < 14) {
        value = value.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }   
    return value;
  }
  sizeObj(obj){
    let size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  } 
}