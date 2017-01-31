import { Pipe, PipeTransform } from '@angular/core';
import {Environment} from '../model/environment';
import {Log} from '../model/log';
import {Filter} from '../model/filter';


export class LogFilter {
  systemFilter (system, systems) {
    let key;
    for (key in systems) {
      if (systems[key].name === system && systems[key].enabled) {
        return true;
      }
    }
    return false;
  };

  public filter(items: Log[], filter: Filter): Log[] {
    let filtered = [],
      testForMessage = !(! filter.message || filter.message.length === 0),
      testForLevel = (filter.level && filter.level.length > 0),
      testForCustomer = (filter.customers && filter.customers.length > 0),
      testForApplication = (filter.applications && filter.applications.length > 0),
      testForEnv = (filter.environments && filter.environments.length > 0),
      testForLogfile = (filter.logfiles && filter.logfiles.length > 0),
      testForRange = (filter.dateFrom !== -1 && filter.dateTill !== -1),
      messageMatch,
      levelMatch: RegExp,
      customerMatch: RegExp,
      applicationMatch: RegExp,
      envMatch: RegExp,
      logfileMatch: RegExp,
      envs = [],
      item: Log,
      i,
      testForSystem = false,
      key;
    try {
      messageMatch = new RegExp(filter.message, 'i');

      if (testForApplication) {
        applicationMatch = new RegExp(filter.applications.join('|').replace(/(\(|\))/g, '\\$1'), 'i');
      }
      if (testForLevel) {
        levelMatch = new RegExp(filter.level.join('|'), 'i');
      }
      if (testForCustomer) {
        customerMatch = new RegExp(filter.customers.join('|'), 'i');
      }
      if (testForEnv) {
        envMatch = new RegExp(filter.environments.join('|').replace(/(\(|\))/g, '\\$1'), 'i');
      }
      if (testForLogfile) {
        logfileMatch = new RegExp(filter.logfiles.join('|').replace(/(\(|\))/g, '\\$1'), 'i');
      }
    } catch (e) {
      return items;
    }
    if (!testForMessage && !testForEnv && !testForLevel && !testForApplication && !testForCustomer && !testForRange && !testForLogfile) {
      for (i in items) { // TODO eigentlich muss hier nur die übergebene liste zurückgegeben werden ... 
        // aber aus irgendeinem grund eine kopie ... da sonst doppelte einträge
        if (items.hasOwnProperty(i)) {
          filtered.push(items[i]);
        }
      }
      return filtered;
    } else {
      for (i in items) {
        if (items.hasOwnProperty(i)) {
          item = items[i];
          if (
              (! testForMessage || (testForMessage && (messageMatch.test(item.message) || messageMatch.test(item.logger))))
                &&
              (! testForEnv  || (testForEnv  && envMatch.test(item.environment.name)))
                &&
              (! testForLevel || (testForLevel && levelMatch.test(item.level)))
                &&
              (! testForLogfile || (testForLogfile && logfileMatch.test(item.application)))
                &&
              (! testForCustomer || (testForCustomer && customerMatch.test(item.environment.customer)))
                &&
              (! testForApplication || (testForApplication && applicationMatch.test(item.environment.application)))
                &&
              (! testForRange || testForRange && item.date > filter.dateFrom && item.date < filter.dateTill)
            ) {
            filtered.push(item);
          }
        }
      }
      return filtered;
    }
  }
}

@Pipe({name: 'logfilter'})
export class LogsFilterPipe implements PipeTransform {
  constructor(private _filter: LogFilter) {}

  transform(items: Log[], args:any[]) : any {
    var filtered = [],
      filter: Filter = args[0];
    return this._filter.filter(items, filter);
  }
}

@Pipe({name: 'envSorter'})
export class EnvSorterPipe implements PipeTransform {
  constructor(private _filter: LogFilter) {}

  transform(envs: Environment[], args:any[]) : any {
    envs.sort(function (a: Environment, b: Environment) {
      return a.customer !== b.customer ? (a.customer < b.customer ? -1 : 1) : (a.name < b.name ? -1: 1);
   });
   return envs;
  }
}
