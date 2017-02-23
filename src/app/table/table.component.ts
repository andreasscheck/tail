import { Component, OnInit, Input, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Log } from '../model/log';
import { LimitToPipe } from '../pipes/limit-to.pipe';
import { LogPoolService } from '../services/log-pool.service';

type ObservableLogs = Observable<Log[]>

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() public highlightPattern: string = '';
  public tableData: Log[] = [];
  public offset: number = -1;
  public limit: number = 20;
  public viewConfig = {
    logger: true,
    product: false,
    keyValues: false,
    system: false,
    application: false
  };

  constructor (private _changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private limitPipe: LimitToPipe,
    private _logpool: LogPoolService) {
    const eventStream = Observable.fromEvent(elementRef.nativeElement, 'mousewheel');
    eventStream.subscribe((event: any) => {
      if (event.srcElement.offsetHeight >= event.srcElement.scrollHeight) {
        if (event.wheelDelta < 0) {
          this.scrollDown();
        } else {
          this.scrollUp();
        }
        this._changeDetector.markForCheck();
        event.preventDefault();
      }
    });

    _logpool.subscribeFilteredLogs().subscribe((logs: Log[]) => {
      if (logs) {
        this.tableData = logs;
      }
      this._changeDetector.markForCheck();
    });
  }

  private scrollDown() {
    this.offset = (this.offset === -1 || this.offset >= this.tableData.length - this.limit) ? -1 : (this.offset + 1);
  }

  private scrollTop() {
    this.offset = -1;
  }

  private scrollUp() {
    this.offset = (this.offset === -1) ? this.tableData.length - this.limit - 1 : (this.offset - 1);
  }
}
