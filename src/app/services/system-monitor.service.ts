import { Injectable } from '@angular/core';
import { Environment } from '../model/environment';
import { Observer, Observable } from 'rxjs/Rx';
import { BackendService } from './backend.service';
import { Log } from '../model/log';
import { Loggable } from '../model/loggable';

@Injectable()
export class SystemMonitorService {

  private _data: Environment[] = [];

  private _envsObserver: Observer<Environment[]>;
  public envs: Observable<Environment[]> = Observable.create(observer => { this._envsObserver = observer; });

  private _logsObserver: Observer<Log>;
  public logs: Observable<Log> = Observable.create(observer => { this._logsObserver = observer; });

  constructor(private _backend: BackendService) {
    this._backend.subscribeLogs().subscribe((log: Log) => {
      if (log) {
        log.environment = this.addEnv(log.environment);
        this.mergeLog(log);
        this._logsObserver.next(log);
      }
    });

    this._backend.subscribeHC().subscribe((env: Environment) => {
      if (env) {
        let find = this.addEnv(env);
        if (!find) {
          this._data.push(env);
        } else {
          find.status = env.status;
        }
        if (this._envsObserver) {
          this._envsObserver.next(this._data);
        }
      }
    });
    this._backend.subscribeConnectionStatus().subscribe((status: number) => {
      switch (status) {
        case 2:
          this.getConfig();
      }
    });
  }

  private getConfig() {
    this._backend.getConfig().subscribe(res => {
      let envkey: string, appname: string, envObj: any, env: Environment, logfile: string, loggable: Loggable;
      for (envkey in res) {
        if (res.hasOwnProperty(envkey)) {
          envObj = res[envkey];
          env = new Environment(envkey);
          env = this.addEnv(env);
          env.name = envObj.environment;
          env.controllable = envObj.controllable || false;
          env.confirmDeploy = envObj.confirm;
          env.customer = envObj.customer;
          env.application = envObj.application;
          env.supportsHotdeploy = envObj.supportsHotdeploy;

          for (appname in envObj.loggables) {
            if (envObj.loggables.hasOwnProperty(appname)) {
              logfile = envObj.loggables[appname];
              loggable = env.addLoggable(appname);
              loggable.logfile = logfile;
            }
          }
        }
      }
      if (this._envsObserver) {
        this._envsObserver.next(this._data);
      }
    });
  }

  mergeLog(log: Log) {
    let env = this.addEnv(log.environment),
      loggable = env.addLoggable(log.application);
    loggable.incrementLogCount();
  }

  getEnv(envkey: string): Environment {
    let key, env: Environment;
    for (key in this._data) {
      if (this._data.hasOwnProperty(key)) {
        env = this._data[key];
        if (env.key === envkey) {
          return this._data[key];
        }
      }
    }
    return null;
  }

  addEnv(envToAdd: Environment): Environment {
    let key, env: Environment;
    for (key in this._data) {
      if (this._data.hasOwnProperty(key)) {
        env = this._data[key];
        if (env.key === envToAdd.key) {
          return this._data[key];
        }
      }
    }
    this._data.push(envToAdd);
    return envToAdd;
  }
}
