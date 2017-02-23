import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-debounced-input',
  templateUrl: './debounced-input.component.html',
  styleUrls: ['./debounced-input.component.css']
})
export class DebouncedInputComponent {
  @Input() placeholder: string;
  @Input() label: string;
  @Input() delay: number = 300;
  @Input() returntype: string = 'string';
  @Output() value: EventEmitter<any> = new EventEmitter<any>();
  @Input() inputValue: string;

  constructor(private elementRef: ElementRef) {
      const eventStream = Observable.fromEvent(elementRef.nativeElement, 'keyup')
          .map(() => this.inputValue)
          .debounceTime(this.delay)
          .distinctUntilChanged();

      eventStream.subscribe(input => {
        if (this.returntype === 'int' && input !== '') {
          this.value.emit(parseInt(input, 10));
        } else {
          this.value.emit(input);
        }
      });
  }
}
