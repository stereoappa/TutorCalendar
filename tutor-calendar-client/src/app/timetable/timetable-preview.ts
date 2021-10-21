import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'app-timetable-preview',
  templateUrl: './timetable-preview.html',
  styleUrls: ['./timetable-preview.scss']
})
export class TimetablePreview implements OnInit {
  @Input() title: string

  @Input() subTitle: string

  constructor() { }

  ngOnInit(): void {
  }
}
