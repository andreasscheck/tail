/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SystemMonitorService } from './system-monitor.service';

describe('SystemMonitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemMonitorService]
    });
  });

  it('should ...', inject([SystemMonitorService], (service: SystemMonitorService) => {
    expect(service).toBeTruthy();
  }));
});
