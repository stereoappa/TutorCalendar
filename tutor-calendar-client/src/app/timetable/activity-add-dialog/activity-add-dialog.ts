import {Component, Inject} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {ActivityAddDialogData, ActivityAddDialogResult} from './activity-dialog-model'
import {Slot} from '../timetable-column'
import {TimelineService} from '../model/timeline.service'
import {Time} from '../model/time-model'

@Component({
  selector: 'app-activity-add-dialog',
  templateUrl: './activity-add-dialog.html',
  styleUrls: ['./activity-add-dialog.scss']
})
export class ActivityAddDialog {
  _data: Slot
  _times: string[]

  constructor(
    public dialogRef: MatDialogRef<ActivityAddDialog>,
    @Inject(MAT_DIALOG_DATA) private initialData: ActivityAddDialogData,
    private readonly _timelineService: TimelineService) {
    this._data = initialData.slot.copy()
    this._times = _timelineService.createTimeline(_timelineService.previewPrecision).map(t => t.toString())
  }

  updateInitialData($event: any) {
    this.initialData.slot.title = this._data.title
    this.initialData.slot.timeRange.start = this._data.timeRange.start
    this.initialData.slot.timeRange.end = this._data.timeRange.end
  }

  cancel(): void {
    this.dialogRef.close()
  }

  save() {
    this.updateInitialData(null)
    this.dialogRef.close(new ActivityAddDialogResult(this.initialData.slot))
  }

  private _isValidTime($event: any) {
    return true
  }

  convertToTime(value: string): Time {
    return Time.createByString(value)
  }
}
