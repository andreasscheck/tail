import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'package'
})
export class PackagePipe implements PipeTransform {
  transform(value: string, args: any) : any {
    var filtered = [],
      pattern: string = args;
      if(value) {
      if(value.indexOf('.') !== -1) {
        return value.substring(value.lastIndexOf('.') + 1);
      } else {
        return value;
      }
    } else {
      return value;
    }
  }
}
