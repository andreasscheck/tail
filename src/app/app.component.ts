import { Component, OnInit } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { LogPoolService } from './services/log-pool.service';
import { Log } from './model/log';
import { SystemMonitorService } from './services/system-monitor.service';
import { Environment } from './model/environment';
import { Filter } from './model/filter';
import { BackendService } from './services/backend.service';
import { SettingsService } from './services/settings.service';
import { Observable } from 'rxjs';

declare var moment: any;
declare var localforage: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public allLogs: Log[] = [];
  public sessions: any = [];
  public sessiondata: any = {};
  public sessionname: string = '';
  public queryEnv: string;
  public dateFrom: any = moment();
  public dateTill: any = moment();
  public clearData: boolean = false;
  public highlightPattern: string;
  public filter: Filter = new Filter();
  public settings: any;
  public connectionStatus: number = 0;
  constructor(private http: Http,
    private _systemMonitor: SystemMonitorService,
    private _backendService: BackendService,
    private _logService: LogPoolService,
    private settingsService: SettingsService) {

    _logService.subscribeFilter().subscribe((filter: Filter) => {
      if (filter) {
        this.filter = filter;
      }
    });
    _backendService.subscribeConnectionStatus().subscribe((status: number) => {
      this.connectionStatus = status;
    });
    _logService.subscribeAllLogs().subscribe((logs: Log[]) => {
      if (logs) {
        this.allLogs = logs;
      }
    });

    localforage.getItem('loggersessions').then((item: any) => {
      this.sessions = item;
      if (!this.sessions) {
        this.sessions = [];
        localforage.setItem('loggersessions', this.sessions);
      }
    });
  }

  ngOnInit() {
    window.onbeforeunload = function(evt) {
      let message = 'Seite wirklich verlassen?';

      if (evt) {
        evt.returnValue = message;
      }
    };
  }

  public getSettings() {
    this.settings = this.settingsService.getSettings();
  }

  private deleteSession(sessionname) {
    let session = this.getSession(sessionname);
    if (session) {
      this.sessions.splice(this.sessions.indexOf(session), 1);
      localforage.setItem('loggersessions', this.sessions);
      localforage.removeItem('session-' + sessionname);
    }
  }
  private saveSettings() {
    this.settingsService.setSettings(this.settings);
  }

  private saveSessionData(value) {
    let session;
    if (this.sessionname) {
      session = this.getSession(this.sessionname);
      if (!session) {
        session = { 'name': this.sessionname };
        this.sessions.push(session);
      }
      session.date = new Date().getTime();
      session.logcount = this.allLogs.length;


      localforage.setItem('session-' + this.sessionname, { 'logs': this.allLogs });
      localforage.setItem('loggersessions', this.sessions);
    }
  }

  private getSession(name: string): any {
    let key;
    for (key in this.sessions) {
      if (this.sessions[key].name === name) {
        return this.sessions[key];
      }
    }
  }

  private loadSessionData(value) {
    console.log('session-' + this.sessionname);
    localforage.getItem('session-' + this.sessionname).then((item: any) => {
      let key, logObject: any, log: Log, logs: Log[] = [];
      for (key in item.logs) {
        if (item.logs.hasOwnProperty(key)) {
          logObject = item.logs[key];
          log = new Log(new Date(logObject._date), logObject._message);
          log.environment = new Environment(logObject._environment._key);
          log.environment.customer = logObject._environment._customer;
          log.environment.name = logObject._environment._name;
          log.level = logObject._level;
          log.application = logObject._application;
          log.logger = logObject._logger;
          log.productName = logObject._productName;
          logs.push(log);
        }
      }
      logs = logs.sort((a: Log, b: Log): number => {
        return b.date - a.date;
      });
      this._logService.loadSessionData(logs);
    });
  }

  private findData(offset: number) {
    let size = 1000, key, log: any, payload: Log, logs: Log[] = [], date: Date, params: URLSearchParams = new URLSearchParams();
    if (this.clearData) {
      this._logService.clearData();
    }
    offset = offset || 0;
    params.set('offset', String(offset));
    params.set('size', String(size));
    params.set('from', this.dateFrom);
    params.set('till', this.dateTill);
    params.set('env', this.queryEnv);
    this.http.get('http://localhost:16060/search', {
      search: params
    }).subscribe(res => { });
  }

  private sort() {
    this._logService.sort();
  }

  private clear() {
    this._logService.clearData();
  }
}
