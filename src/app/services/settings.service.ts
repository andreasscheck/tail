import { asObservable } from '../util/asObservable';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var localforage;

@Injectable()
export class SettingsService {
  private _settingsSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  private settings: any = {
    'username': '',
    'host': 'localhost',
    'port': 16060
  };

  constructor() {
    localforage.getItem('settings').then((item: any) => {
      if (item) {
        this.settings = item;
        this._settingsSubject.next(this.settings);
      }
    });
  }

  public subscribeSettings(): Observable<any> {
    return asObservable(this._settingsSubject);
  }

  public getSettings() {
    return this.settings;
  }

  public setSettings(settings: any) {
    localforage.setItem('settings', this.settings);
    this._settingsSubject.next(this.settings);
  }
}
