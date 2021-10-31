import {Component} from '@angular/core'
import {PreviewData} from './timetable-preview.service'
import {Slot} from './timetable-column.component'

@Component({
  selector: 'app-timetable-preview',
  templateUrl: './timetable-preview.component.html',
  styleUrls: ['./timetable-preview.component.scss']
})
export class TimetablePreviewComponent {
  datekeys: number[] | []

  preview: Slot

  constructor(previewData: PreviewData) {
    this.preview = previewData.preview
    this.datekeys = previewData.datekeys
  }

  _getDayPreview(datekey: number): Slot[] {
    if (this.preview.position.datekey === datekey) {
      return [this.preview]
    }
  }
}
