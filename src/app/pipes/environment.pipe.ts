import { Pipe, PipeTransform } from '@angular/core';
import { Environment } from '../model/environment';

@Pipe({
  pure: false,
  name: 'envstatus'
})
export class EnvironmentPipe implements PipeTransform {
  transform (value: Environment, args: string[]): string {
    switch (value.status) {
      case 0:
        return 'Unknown';
      case 1:
        return 'Online';
      case 2:
        return 'Offline';
      case 3:
        return 'Working';
      case 4:
        return 'Deploying';
      case 5:
        return 'Startup';
      case 6:
        return 'Shutdown';
      default:
        return 'NA';
    }
  }
}
