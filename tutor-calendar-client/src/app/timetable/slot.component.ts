import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss']
})
export class SlotComponent implements OnInit {
  @Input() title: string

  @Input() subTitle: string

  constructor() { }

  ngOnInit(): void {
  }
}
