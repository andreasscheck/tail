import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Environment } from '../model/environment';
import { BackendService } from '../services/backend.service';
import { LogPoolService } from '../services/log-pool.service';
import { SystemMonitorService } from '../services/system-monitor.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  @Input() heading: string;
  @Output() patternchanged: EventEmitter<string> = new EventEmitter<string>();

  private collapsed: boolean = false;

  private environments: Environment[] = [];

  private hightlightPattern: string = '';

  constructor(private _backend: BackendService, private _logpool: LogPoolService, private _systemMonitor: SystemMonitorService) {
    _systemMonitor.envs.subscribe((envs: Environment[]) => {
      this.environments = envs;
    });
  }

  stopTails() {
    for (let key in this.environments) {
      if ( this.environments.hasOwnProperty(key)) {
        this._backend.stopTail(this.environments[key]);
      }
    }
  }
  filter(value) {
    let filter;
    try {
        new RegExp(value);
        filter = this._logpool.getFilter();
        filter.message = value;
        this._logpool.applyFilter(filter);
    } catch (ignore) {}
  }
  highlight(value) {
    try {
        new RegExp(value);
        this.patternchanged.emit(value);
    } catch (ignore) {}
  }

  beepOn(value) {
  }
}
