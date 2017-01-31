/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DebouncedInputComponent } from './debounced-input.component';

describe('DebouncedInputComponent', () => {
  let component: DebouncedInputComponent;
  let fixture: ComponentFixture<DebouncedInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebouncedInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebouncedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
