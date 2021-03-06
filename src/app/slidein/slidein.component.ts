import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slidein',
  templateUrl: './slidein.component.html',
  styleUrls: ['./slidein.component.css']
})
export class SlideinComponent {
  @Input() heading: string;
  @Input() position: string = 'bottom';

  private collapsed: boolean = true;

  togglevisibility() {
    this.collapsed = ! this.collapsed;
  }
}
