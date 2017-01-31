import {Environment} from './environment';
export class Loggable {
  private _logfile: string;
  private _application: string;
  private _enabled: boolean = true;
  private _env: Environment;
  private _logcount: number = 0;

  constructor(env: Environment) {
    this._env = env;
  }

  incrementLogCount() {
    this.logcount = this.logcount + 1;
  }
  get logfile(): string {
    return this._logfile;
  }
  get application(): string {
    return this._application;
  }
  get environment(): Environment {
    return this._env;
  }
  get enabled(): boolean {
    return this._enabled;
  }
  get logcount(): number {
    return this._logcount;
  }
  set logfile(logfile: string) {
    this._logfile = logfile;
  }
  set application(application: string) {
    this._application = application;
  }
  set environment(env: Environment) {
    this._env = env;
  }
  set enabled(enabled: boolean) {
    this._enabled = enabled;
  }
  set logcount(logcount: number) {
    this._logcount = logcount;
  }
}
