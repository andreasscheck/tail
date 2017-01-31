import {Environment} from './environment';

export class KeyValue {
  constructor(
    private _key: Date,
    private _value: string) {}
}

export class Log {
  private _message: string;
  private _date: number;
  private _environment: Environment;
  private _level: string;
  private _application: string;
  private _logger: string;
  private _productName: string;
  private _keyValues: KeyValue[];

  constructor(date: Date, message: string) {
    this.date = date.getTime();
    this.message = message;
  }

  set message(message: string) {
    this._message = message;
  }

  set date(date: number) {
    this._date = date;
  }

  set environment(environment: Environment) {
    this._environment = environment;
  }

  set level(level: string) {
    this._level = level;
  }

  set application(application: string) {
    this._application = application;
  }

  set logger(logger: string) {
    this._logger = logger;
  }

  set productName(productName: string) {
    this._productName = productName;
  }

  set keyValues(keyValues: KeyValue[]) {
    this._keyValues = keyValues;
  }

  get message() {
    return this._message;
  }

  get date() {
    return this._date;
  }

  get environment() {
    return this._environment;
  }

  get level() {
    return this._level;
  }

  get application() {
    return this._application;
  }

  get logger() {
    return this._logger;
  }

  get productName() {
    return this._productName;
  }

  get keyValues() {
    return this._keyValues;
  }
}
