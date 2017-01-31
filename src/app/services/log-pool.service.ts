import {Injectable, OnInit} from '@angular/core';
import {SystemMonitorService} from './system-monitor.service';
import {BackendService} from './backend.service';
import {Log} from '../model//log';
import {LogFilter} from '../pipes/log-filter.pipe'
import {Filter} from '../model/filter';
import {Observer, Observable, BehaviorSubject} from 'rxjs/Rx';
import {asObservable} from '../util/asObservable';

@Injectable()
export class LogPoolService {
  private _filter = new Filter();

  private _allLogs: Log[] = [];
  private _filteredLogs: Log[] = [];
  private _beepOn: RegExp;
  private _hightlight: RegExp;

  private _allLogsSubject: BehaviorSubject<Log[]> = new BehaviorSubject(null);

  private _filteredLogsSubject: BehaviorSubject<Log[]> = new BehaviorSubject(null);

  private _filterSubject: BehaviorSubject<Filter> = new BehaviorSubject(null);

  constructor(private _monitor: SystemMonitorService, private _backend: BackendService, private _allLogsFilter: LogFilter) {
    this._monitor.logs.subscribe((log: Log) => {
      if (log) {
        this._allLogs.push(log);
        this._allLogsSubject.next(this._allLogs);
        let filtered = this._allLogsFilter.filter([log], this._filter);

        if (filtered.length >= 1) {
          this._filteredLogs.push(filtered[0]);
          this._filteredLogsSubject.next(this._filteredLogs);
        }
      }
    });
  }

  public subscribeFilteredLogs(): Observable<Log[]> {
    return asObservable(this._filteredLogsSubject);
  }

  public subscribeAllLogs(): Observable<Log[]> {
    return asObservable(this._allLogsSubject);
  }
  public subscribeFilter(): Observable<Filter> {
    return asObservable(this._filterSubject);
  }

  private filter() {
    this._filteredLogs = this._allLogsFilter.filter(this._allLogs, this._filter);
     // diese Zeile fatal: kein filter -> alle ergebnisse, 
    // was einfach this._allLogs ist. D.h. filteredLogs hat dann eine Referenz auf 
    // allLogs, wodurch dann logs doppelt gepushed werden. 
    // Gelöst im Filter (array kopieren) ... hässlich?

    this._filteredLogsSubject.next(this._filteredLogs);
    this._filterSubject.next(this._filter);
  }

  public getFilter(): Filter {
    let filter: any = {};
    filter = Filter.copy(this._filter);
    return filter;
  }
  applyFilter(filter: Filter) {
    let customerSearch = false, key,
      applicationSearch = false,
      levelSearch = false,
      envSearch = false,
      messageSearch = false,
      rangeSearch = false,
      logfileSearch = false;

    if (this._filter.message !== filter.message) {
      this._filter.message = filter.message;
      messageSearch = true;
    }

    if (this._filter.dateFrom !== filter.dateFrom) {
      this._filter.dateFrom = filter.dateFrom;
      rangeSearch = true;
    }
    if (this._filter.dateTill !== filter.dateTill) {
      this._filter.dateTill = filter.dateTill;
      rangeSearch = true;
    }
    if (this._filter.level.length !== filter.level.length) {
      this._filter.level = [];
      for (key in filter.level) {
        this._filter.level.push(filter.level[key]);
      }
      levelSearch = true;
    }
    if (this._filter.applications.length !== filter.applications.length) {
      this._filter.applications = [];
      for (key in filter.applications) {
        this._filter.applications.push(filter.applications[key]);
      }
      applicationSearch = true;
    }
    if (this._filter.environments.length !== filter.environments.length) {
      this._filter.environments = [];
      for (key in filter.environments) {
        this._filter.environments.push(filter.environments[key]);
      }
      envSearch = true;
    }
    if (this._filter.customers.length !== filter.customers.length) {
      this._filter.customers = [];
      for (key in filter.customers) {
        this._filter.customers.push(filter.customers[key]);
      }
      customerSearch = true;
    }
    if (this._filter.logfiles.length !== filter.logfiles.length) {
      this._filter.logfiles = [];
      for (key in filter.logfiles) {
        this._filter.logfiles.push(filter.logfiles[key]);
      }
      logfileSearch = true;
    }
    if(customerSearch || applicationSearch || levelSearch || rangeSearch || messageSearch || envSearch || logfileSearch) {
      this.filter();
    }
  }


  public loadSessionData(logs: Log[]) {
    this._allLogs = logs;
    this.filter();
  }

  public addSessionData(logs: Log[]) {
    let key;
    for (key in logs) {
      this._allLogs.push(logs[key]);
    }
    this.filter();
  }

  public sort() {
    this._allLogs = this._allLogs.sort((a: Log, b: Log): number => {
      return b.date - a.date;
    });
    this.filter();
  }

  public clearData() {
    this._allLogs = [];
    this.filter();
  }

  set beepOn(pattern: string) {
    if (pattern) {
      this._hightlight = new RegExp(pattern, 'i');
    }
  }
}
