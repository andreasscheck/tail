export class ChatMsg {
  private _message: string;
  private _date: Date;

  constructor(date: Date, message: string) {
    this.setDate(date).setMessage(message);
  }

  setMessage(message: string) {
    this._message = message;
    return this;
  }

  setDate(date: Date) {
    this._date = date;
    return this;
  }

  message() {
    return this._message;
  }

  date() {
    return this._date;
  }
}
