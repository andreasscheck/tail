import { Pipe, PipeTransform } from '@angular/core';
import { Log } from '../model/log';
@Pipe({
  pure: false,
  name: 'limitTo'
})
export class LimitToPipe implements PipeTransform {
  constructor() {}

  transform(items: Log[], args: any[]): any {
    if (!items) {
      return [];
    }
    let limit = args['limit'];
    let offset = args['offset'] === -1 ? items.length - limit : args['offset'];
    let start = Math.max(0, offset);
    let end = Math.min(start + limit, items.length);

    return items.slice(start, end);
  }
}
