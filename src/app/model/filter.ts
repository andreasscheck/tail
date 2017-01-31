import {Loggable} from './loggable';

export class Filter {
  private _message: string = "";
  private _customers: string[] = [];
  private _applications: string[] = [];
  private _environments: string[] = [];
  private _logfiles: string[] = [];
  private _level: string[] = [];
  private _dateFrom: number = -1;
  private _dateTill: number = -1;

  constructor() {
  }

  static copy(source: Filter): Filter {
    let filter = new Filter(), key;

    filter.message = source.message;
    filter.customers = source.customers;
    filter.applications = source.applications;
    filter.dateFrom = source.dateFrom;
    filter.dateTill = source.dateTill;
    filter.environments = source.environments;

    for(key in source.level) {
      filter.level.push(source.level[key]);
    }
    return filter;
  }

  set message(message: string) {
    this._message = message;
  }

  set level(level: string[]) {
    this._level = level;
  }

  set dateFrom(dateFrom: number) {
    this._dateFrom = dateFrom;
  }

  set dateTill(dateTill: number) {
    this._dateTill = dateTill;
  }

  set customers(customers: string[]) {
    this._customers = customers;
  }

  set applications(applications: string[]) {
      this._applications = applications;
  }

  set environments(environments: string[]) {
      this._environments = environments;
  }

  set logfiles(logfiles: string[]) {
    this._logfiles = logfiles;
  }

  get message(): string {
    return this._message;
  }

  get level(): string[] {
    return this._level;
  }

  get logfiles(): string[] {
    return this._logfiles;
  }

  get dateFrom(): number {
    return this._dateFrom;
  }

  get dateTill(): number {
    return this._dateTill;
  }

  get customers(): string[] {
    return this._customers;
  }

  get applications(): string[] {
    return this._applications;
  }

  get environments(): string[] {
    return this._environments;
  }
}
