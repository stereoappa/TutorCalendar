import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'app-timetable-slot',
  templateUrl: './timetable-slot.component.html',
  styleUrls: ['./timetable-slot.component.scss']
})
export class TimetableSlotComponent implements OnInit {
  @Input() title: string

  @Input() timeRangeTitle: string

  constructor() { }

  ngOnInit(): void {
  }
}
