import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'app-timetable-preview',
  templateUrl: './timetable-preview.component.html',
  styleUrls: ['./timetable-preview.component.scss']
})
export class TimetablePreviewComponent implements OnInit {
  @Input() title: string

  @Input() subTitle: string

  constructor() { }

  ngOnInit(): void {
  }
}
