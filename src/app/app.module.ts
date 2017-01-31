import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { SlideinComponent } from './slidein/slidein.component';
import { TableComponent } from './table/table.component';
import { LimitToPipe } from './pipes/limit-to.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { NavigationComponent } from './navigation/navigation.component';
import { NavitemComponent } from './navigation/navitem/navitem.component';
import { EnvironmentComponent } from './navigation/environment/environment.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ChartComponent } from './chart/chart.component';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { PackagePipe } from './pipes/package.pipe';
import { DebouncedInputComponent } from './debounced-input/debounced-input.component';
import { EnvSorterPipe, LogFilter }from './pipes/log-filter.pipe';
import { EnvironmentPipe } from './pipes/environment.pipe';
import { BackendService } from './services/backend.service';
import { SystemMonitorService } from './services/system-monitor.service';
import { LogPoolService } from './services/log-pool.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MathMinPipe, MathMaxPipe } from './pipes/math.pipe';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    SlideinComponent,
    TableComponent,
    LimitToPipe,
    HighlightPipe,
    NavigationComponent,
    NavitemComponent,
    EnvironmentComponent,
    ChartComponent,
    FormatDatePipe,
    PackagePipe,
    DebouncedInputComponent,
    EnvSorterPipe,
    EnvironmentPipe,
    MathMinPipe,
    MathMaxPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    Ng2Bs3ModalModule,
    FileUploadModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [BackendService, SystemMonitorService, LogPoolService, LogFilter, LimitToPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
