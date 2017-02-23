import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Filter } from '../model/filter';
import { Observable } from 'rxjs/Observable';
import { Log } from '../model/log';
import { LogFilter } from '../pipes/log-filter.pipe';
import { LogPoolService } from '../services/log-pool.service';

declare var d3;
declare var dc;
declare var crossfilter;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Output() private range: EventEmitter<Filter> = new EventEmitter<Filter>();

  private from: Date = new Date();
  private till: Date = new Date();
  private piechartWidth: number = 200;
  private ctx: any;
  private volumeChart: any;
  private pieChart: any;
  private pieChart2: any;
  private pieChart3: any;
  private pieChart4: any;
  private pieChart5: any;
  private timeChart: any;
  private dtgFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');
  useFilteredLogs: boolean = false;

  private cdata: any[] = [];

  private search: boolean = false;
  private facts = crossfilter(this.cdata);

  private volumeByHour = this.facts.dimension(function(d) {
      return d3.time.minute(d.dtg);
  });
  private quarter = this.facts.dimension(function (d) {
      return d.level;
  });
  private apps = this.facts.dimension(function (d) {
      return d.app;
  });
  private logs = this.facts.dimension(function (d) {
      return d.log;
  });
  private envs = this.facts.dimension(function (d) {
      return d.envname;
  });
  private customers = this.facts.dimension(function (d) {
      return d.customer;
  });
  private volumeByHourGroup = this.volumeByHour.group().reduceCount(function(d) {
    return d.dtg;
  });
  private quarterGroup = this.quarter.group().reduceSum(function (d) {
      return 1;
  });
  private appsGroup = this.apps.group().reduceSum(function (d) {
      return 1;
  });
  private logsGroup = this.logs.group().reduceSum(function (d) {
      return 1;
  });
  private envGroup = this.envs.group().reduceSum(function (d) {
      return 1;
  });
  private customersGroup = this.customers.group().reduceSum(function (d) {
      return 1;
  });
  private colorScale = d3.scale.ordinal().domain(['INFO', 'WARNING', 'SEVERE', 'ERROR', 'UNKNOWN'])
      .range(['#00cc00', '#faa634', '#ff0000', '#ff0000', '#cccccc']);

  private data: Log[];
  private allData: Log[];
  private filteredData: Log[];

  constructor (private _logService: LogPoolService) {
    _logService.subscribeAllLogs().subscribe((data: Log[]) => {
        this.allData = data;
    });
    _logService.subscribeFilteredLogs().subscribe((data: Log[]) => {
        this.filteredData = data;
    });
  }

  ngOnInit(): any {
      let instance = this;

      let timer = Observable.timer(10000, 5000);
      timer.subscribe(t => this.redraw());

      this.timeChart = dc.lineChart('#dc-time-chart');
      this.volumeChart = dc.barChart('#dc-volume-chart');
      this.pieChart = dc.pieChart('#dc-pie-chart');
      this.pieChart2 = dc.pieChart('#dc-pie-chart2');
      this.pieChart3 = dc.pieChart('#dc-pie-chart3');
      this.pieChart4 = dc.pieChart('#dc-pie-chart4');
      this.pieChart5 = dc.pieChart('#dc-pie-chart5');
      this.timeChart.on('renderlet', (chart) => {
          let filter = this._logService.getFilter();
          if (chart && chart.filters()) {
              let range = chart.filters()[0];
              if (range) {
                  filter.dateFrom = new Date(range[0]).getTime();
                  filter.dateTill = new Date(range[1]).getTime();
              } else {
                filter.dateFrom = -1;
                filter.dateTill = -1;
              }
          } else {
            filter.dateFrom = -1;
            filter.dateTill = -1;
          }
          filter.level = this.pieChart.filters() || [];
          filter.applications = this.pieChart2.filters() || [];
          filter.customers = this.pieChart3.filters() || [];
          filter.environments = this.pieChart4.filters() || [];
          filter.logfiles = this.pieChart5.filters() || [];
          this._logService.applyFilter(filter);
      });

      this.timeChart.width(450).height(150)
          .transitionDuration(500)
          .renderDataPoints({radius: 3, fillOpacity: 0.5, strokeOpacity: 0.5})
          .margins({top: 10, right: 10, bottom: 20, left: 40})
          .rangeChart(this.volumeChart)
          .dimension(this.volumeByHour)
          .group(this.volumeByHourGroup)
          .brushOn(false)
          .title(function(d){
              return (d.key.toLocaleString())
                  + '\nNumber of logs: ' + d.value;
          })
          .renderHorizontalGridLines(true)
          .elasticY(true)
          .x(d3.time.scale().domain(d3.extent(this.cdata, function(d) { return d.dtg; })))
          .round(d3.time.minute.round)
          .xUnits(d3.time.minutes);


      this.volumeChart.width(450).height(60)
          .margins({top: 10, right: 10, bottom: 20, left: 40})
          .dimension(this.volumeByHour)
          .group(this.volumeByHourGroup)
          .centerBar(true)
          .gap(1)
          .x(d3.time.scale().domain(d3.extent(this.cdata, function(d) { return d.dtg; })))
          .round(d3.time.minute.round)
          .alwaysUseRounding(true)
          .elasticY(true)
          .xUnits(d3.time.minutes);
      this.volumeChart.yAxis().ticks(0);

      this.pieChart.width(this.piechartWidth).height(this.piechartWidth)
        .radius(100)
        .innerRadius(30)
        .dimension(this.quarter)
        .group(this.quarterGroup)
        .colors(function(d) {
          return instance.colorScale(d);
        });

      this.pieChart2.width(this.piechartWidth).height(this.piechartWidth)
        .innerRadius(30)
        .dimension(this.apps)
        .radius(100)
        .group(this.appsGroup);

      this.pieChart3.width(this.piechartWidth).height(this.piechartWidth)
        .dimension(this.customers)
        .radius(100)
        .innerRadius(30)
        .group(this.customersGroup);

      this.pieChart4.width(this.piechartWidth).height(this.piechartWidth)
        .dimension(this.envs)
        .radius(100)
        .innerRadius(30)
        .group(this.envGroup);

      this.pieChart5.width(this.piechartWidth).height(this.piechartWidth)
        .dimension(this.logs)
        .radius(100)
        .innerRadius(30)
        .group(this.logsGroup);
      dc.renderAll();
  }

  redraw() {
    let key;
    this.data = this.useFilteredLogs ? this.filteredData : this.allData;
    if (! this.data || ! this.data.length || this.data.length === 0) {
      return;
    }
    this.cdata = [];
    // compile data
    for (key = 0; key < this.data.length; key = key + 1) {
        let log: Log = this.data[key];

        this.cdata.push({
            dtg: log.date,
            level: log.level,
            envname: log.environment.name,
            customer: log.environment.customer,
            app: log.environment.application,
            log: log.application
        });
    }
    this.resetData();
    this.facts.add(this.cdata);

    this.volumeChart
        .x(d3.time.scale().domain(d3.extent(this.cdata, function(d) { return d.dtg; })));

    this.timeChart
        .x(d3.time.scale().domain(d3.extent(this.cdata, function(d) { return d.dtg; })));

    dc.redrawAll();
  }

  resetData() {
      let timeChartFilters = this.timeChart.filters(),
        volumeChartFilters = this.volumeChart.filters(),
        pieChart1Filters = this.pieChart.filters(),
        pieChart2Filters = this.pieChart2.filters(),
        pieChart3Filters = this.pieChart3.filters(),
        pieChart4Filters = this.pieChart4.filters(),
        pieChart5Filters = this.pieChart5.filters();

      dc.filterAll();

      this.facts.remove();

      this.timeChart.filter([timeChartFilters]);

      if (volumeChartFilters.length === 1) {
          this.volumeChart.filter(dc.filters.RangedFilter(volumeChartFilters[0][0], volumeChartFilters[0][1]));
      }

      this.pieChart.filter([pieChart1Filters]);
      this.pieChart2.filter([pieChart2Filters]);
      this.pieChart3.filter([pieChart3Filters]);
      this.pieChart4.filter([pieChart4Filters]);
      this.pieChart5.filter([pieChart5Filters]);

  }

  reset() {
    this.range.emit(new Filter());
    dc.filterAll();
  }
}
