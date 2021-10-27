import {Component, Input, OnInit} from '@angular/core'
import {PreviewData} from './timetable-preview.service'
import {Slot} from './timetable-column.component'

@Component({
  selector: 'app-timetable-preview',
  templateUrl: './timetable-preview.component.html',
  styleUrls: ['./timetable-preview.component.scss']
})
export class TimetablePreviewComponent implements OnInit {
  @Input() title: string

  @Input() subTitle: string

  previewData: PreviewData

  constructor(previewData: PreviewData) {
    this.previewData = previewData
  }

  ngOnInit(): void {
  }

  _getDatekeys() {
    return this.previewData.datekeys
  }

  _getSlotPreview(datekey: number): Slot[] {
    if (this.previewData.datekey === datekey) {
      return [new Slot(this.title, this.subTitle, null, this.previewData.position)]
    }
  }
}
