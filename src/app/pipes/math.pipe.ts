import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mathmax'
})
export class MathMaxPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Math.max(value, args['alt']);
  }
}

@Pipe({
  name: 'mathmin'
})
export class MathMinPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Math.min(value, args['alt']);
  }
}
