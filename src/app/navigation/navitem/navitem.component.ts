import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navitem',
  templateUrl: './navitem.component.html',
  styleUrls: ['./navitem.component.css']
})
export class NavitemComponent {
  @Input() heading: string;
  @Input() visible: string = "shownav";
  constructor() {
  }
  toggle() {
    this.visible = (this.visible === "shownav") ? 'hidenav' : 'shownav';
  }
}
