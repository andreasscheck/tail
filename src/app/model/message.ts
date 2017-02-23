import { BackendService } from '../services/backend.service';

export class Message {
  private _message: String;
  private _date: Date;
  private _sender: String;

  constructor(message: String, date: Date, sender: String) {
    this._date = date;
    this.message = message;
    this.sender = sender;
  }

  public set message(message: String) {
    this._message = message;
  }

  public get message() {
    return this._message;
  }

  public set date(date: Date) {
    this._date = date;
  }

  public get date() {
    return this._date;
  }

  public set sender(sender: String) {
    this._sender = sender;
  }

  public get sender() {
    return this._sender;
  }
}
