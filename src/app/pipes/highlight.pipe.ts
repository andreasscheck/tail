import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, args: any): any {
    if (args) {
      let filtered = [],
        pattern: string = args;
      return value.replace(new RegExp('(' + pattern + ')', 'gi'), '<b class="highlight">$1</b>');
    } else {
      return value;
    }
  }
}
