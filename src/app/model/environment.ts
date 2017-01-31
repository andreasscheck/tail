import {Loggable} from './loggable';

export class Environment {
  private _status: number;
  private _key: string;
  private _name: string;
  private _customer: string;
  private _application: string;
  private _logEnabled: boolean = true;
  private _controllable: boolean = false;
  private _supportsHotdeploy: boolean = false;
  private _confirmDeploy: boolean = true;
  private _loggables: Loggable[] = [];

  constructor(key: string) {
    this.key = key;
  }

  public addLoggable(application: string): Loggable {
    let key, loggable: Loggable;
    for(key in this.loggables) {
      loggable = this.loggables[key];
      if(loggable.application === application) {
        return loggable;
      }
    }
    loggable = new Loggable(this);
    loggable.application = application;
    this.loggables.push(loggable);
    return loggable;
  }

  getLoggable(application: string): Loggable {
    let key, loggable: Loggable;
    for(key in this.loggables) {
      loggable = this.loggables[key];
      if(loggable.application === application) {
        return loggable;
      }
    }
    return null;
  }

  set loggables(loggables: Loggable[]) {
    this._loggables = loggables;
  }

  set name(name: string) {
    this._name = name;
  }

  set status(status: number) {
    this._status = status;
  }

  set controllable(controllable: boolean) {
    this._controllable = controllable;
  }

  set supportsHotdeploy(supportsHotdeploy: boolean) {
      this._supportsHotdeploy = supportsHotdeploy;
  }

  set logEnabled(logEnabled: boolean) {
    this._logEnabled = logEnabled;
  }

  set confirmDeploy(confirm: boolean) {
    this._confirmDeploy = confirm;
  }

  set customer(customer: string) {
    this._customer = customer;
  }

  set key(key: string) {
    this._key = key;
  }

  set application(application: string) {
    this._application = application;
 }
  get status() : number {
    return this._status;
  }

  get loggables(): Loggable[] {
      return this._loggables;
  }

  get name(): string {
    return this._name;
  }

  get controllable(): boolean {
    return this._controllable;
  }

  get supportsHotdeploy(): boolean {
    return this._supportsHotdeploy;
  }

  get logEnabled(): boolean {
    return this._logEnabled;
  }

  get confirmDeploy(): boolean {
    return this._confirmDeploy;
  }
  get customer(): string {
    return this._customer;
  }

  get key(): string {
    return this._key;
  }

  get application(): string {
     return this._application;
  }
}
