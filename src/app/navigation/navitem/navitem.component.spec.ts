/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavitemComponent } from './navitem.component';

describe('NavitemComponent', () => {
  let component: NavitemComponent;
  let fixture: ComponentFixture<NavitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
