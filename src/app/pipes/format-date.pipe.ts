import { Pipe, PipeTransform } from '@angular/core';

declare var moment;

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(date: any, format: String) : any {
    return moment(date).format(format);
  }
}
