/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LogPoolService } from './log-pool.service';

describe('LogPoolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogPoolService]
    });
  });

  it('should ...', inject([LogPoolService], (service: LogPoolService) => {
    expect(service).toBeTruthy();
  }));
});
