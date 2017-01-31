/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { MathMinPipe, MathMaxPipe } from './math.pipe';

describe('MatMinhPipe', () => {
  it('create an instance', () => {
    let pipe = new MathMinPipe();
    expect(pipe).toBeTruthy();
  });
});
describe('MatMaxhPipe', () => {
  it('create an instance', () => {
    let pipe = new MathMaxPipe();
    expect(pipe).toBeTruthy();
  });
});
