import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'connectionStatus'
})
export class ConnectionStatusPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    switch (value) {
      case 1:
        return 'Connecting';
      case 2:
        return 'Connected';
      default:
        return 'Disconnected';
    }
  }
}
