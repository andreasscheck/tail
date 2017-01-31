export class System {
  private _status: string;
  private _name: string;
  private _enabled: boolean = false;


  constructor(name: string) {
    this.setName(name);
  }

  setName(name: string) {
    this._name = name;
    return this;
  }

  setStatus(status: string) {
    this._status = status;
    return this;
  }

  setControllable(enabled: boolean) {
    this._enabled = enabled;
    return this;
  }

  status() {
    return this._status;
  }

  name() {
    return this._name;
  }

  enabled() {
    return this._enabled;
  }
}
