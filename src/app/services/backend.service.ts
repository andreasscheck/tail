import { Injectable } from '@angular/core';
import { Observer, Observable, BehaviorSubject } from 'rxjs/Rx';
import { Environment } from '../model/environment';
import { Log } from '../model/log';
import { Http } from '@angular/http';
import { asObservable } from "../util/asObservable";
import { LogFilter } from '../pipes/log-filter.pipe';

@Injectable()
export class BackendService {
  private _ws: WebSocket;


  private _logSubject: BehaviorSubject<Log> = new BehaviorSubject(null);
  private _hcSubject: BehaviorSubject<Environment> = new BehaviorSubject(null);
  private _chatSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  private reconnectionInterval: number = 5000
  private connectionTimer: any;
  private subscription: any;
  private connected: boolean = false;

  constructor(private _http: Http, private _logsFilter: LogFilter) {
    this.reconnect();
  }

  private reconnect() {
    if (!this._ws || this._ws.readyState === WebSocket.CLOSED) {
      this.connect();
    }
    window.setTimeout(() => {
      this.reconnect();
    }, 5000);
  }

  private connect() {
    console.log("connecting ...");
    this._ws = new WebSocket('ws://10.1.3.177:16060/chat');
    this._ws.onmessage = (event: MessageEvent) => {
      this.onmessage(event);
    }
    this._ws.onopen = (event: Event) => {
      console.log("connection established ");
      this.connected = true;
    }
    this._ws.onclose = (event: Event) => {
      console.log("connection lost");
      this.connected = false;
    }
  }

  public subscribeLogs(): Observable<Log> {
    return asObservable(this._logSubject);
  }

  public subscribeHC(): Observable<Environment> {
    return asObservable(this._hcSubject);
  }

  public subscribeChat(): Observable<string> {
    return asObservable(this._chatSubject);
  }

  public startTail(env: Environment) {
    let cmd = { 'type': 'control', 'cmd': 'starttail', 'env': env.key };
    this.send(cmd);
  }

  public stopTail(env: Environment) {
    let cmd = { 'type': 'control', 'cmd': 'stoptail', 'env': env.key };
    this.send(cmd);
  }

  public startServer(env: Environment) {
    let cmd = { 'type': 'control', 'cmd': 'startserver', 'env': env.key };
    this.send(cmd);
  }

  public stopServer(env: Environment) {
    let cmd = { 'type': 'control', 'cmd': 'stopserver', 'env': env.key };
    this.send(cmd);
  }

  public openTerminal(env: Environment) {
    let cmd = { 'type': 'control', 'cmd': 'openterminal', 'env': env.key };
    this.send(cmd);
  }

  private send(msg: any) {
    this._ws.send(JSON.stringify(msg));
  }

  public onmessage: (ev: MessageEvent) => void = function(event: MessageEvent) {
    let logs = JSON.parse(event.data), i, payload: Log, filtered: Log[], key, env, message = '';

    for (i in logs) {
      if (logs.hasOwnProperty(i)) {
        let log = logs[i], date;

        if (typeof log.message.date === 'undefined') {
          date = new Date();
        } else {
          date = new Date(log.message.date);
        }
        if (isNaN(date.getDate())) {
          date = new Date();
        }
        if (typeof log.message.message === 'string') {
          message = log.message.message;
        } else {
          for (key in log.message.message) {
            if (log.message.message.hasOwnProperty(key)) {
              message = message + key + ': ' + log.message.message[key] + '\n';
            }
          }
        }
        payload = new Log(date, message);

        payload.environment = new Environment(log.environment);
        if (log.message.level === 'CHAT') {
        } else if (log.message.level === 'HEALTHSTATUS') {
          for (key in log.message.message) {
            if (log.message.message.hasOwnProperty(key)) {
              env = new Environment(key);
              env.status = log.message.message[key].available;
              this._hcSubject.next(env);
            }
          }
        } else {
          payload.application = log.application;
          payload.level = log.message.level;
          payload.logger = log.message.loggername;
          payload.productName = log.message.productName;

          this._logSubject.next(payload);
        }
      }
    }
  };

  getConfig() {
    return this._http.get('http://10.1.3.177:16060/config').map(res => res.json());
  }
}
