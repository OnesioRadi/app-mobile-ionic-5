import {Injectable} from '@angular/core';

@Injectable()
export class Utils {
  private n: any;
  private len: any;

  detectAmount(v): string {
    if (v) {
      this.n = v[v.length - 1];
      if (isNaN(this.n)) {
        v = v.substring(0, v.length - 1);
        return v;
      }
      v = this.fixAmount(v);
      return v;
    }
  }

  paddingValue(num:number, size:number): string{    
    return this.pad(num, size);
  }

  private fixAmount(a): string {
    let period = a.indexOf(",");
    if (period > -1) {
      a = a.substring(0, period) + a.substring(period + 1);
    }
    this.len = a.length;
    while (this.len < 3) {
      a = "0" + a;
      this.len = a.length;
    }
    a = a.substring(0, this.len - 2) + "," + a.substring(this.len - 2, this.len);
    while (a.length > 4 && (a[0] == '0')) {
      a = a.substring(1)
    }
    if (a[0] == ",") {
      a = "0" + a;
    }
    a = a.replace(/\D/g,"") //permite digitar apenas números
    a = a.replace(/[0-9]{11}/,0) //limita pra máximo 999.999.999,99
    a = a.replace(/(\d{1})(\d{13})$/,"$1.$2") //coloca ponto antes dos últimos 13 digitos
    a = a.replace(/(\d{1})(\d{10})$/,"$1.$2") //coloca ponto antes dos últimos 10 digitos
    a = a.replace(/(\d{1})(\d{5})$/,"$1.$2") //coloca ponto antes dos últimos 7 digitos
    a = a.replace(/(\d{1})(\d{1,2})$/,"$1,$2") //coloca virgula antes dos últimos 4 digitos
    return (a);
  }

  private pad(num:number, size:number): string{    
    let value = num+"";
    while (value.length < size) value = "0" + value;
    return value; 
  }
} 
