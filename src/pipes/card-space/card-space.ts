import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardspace',
})
export class CardSpacePipe implements PipeTransform {
  
  transform(value: string, ...args) {
     return value.split('.').join(' ');
  }
}
