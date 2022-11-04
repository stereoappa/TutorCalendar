import {Component, Inject} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {ActivityAddDialogData, ActivityAddDialogResult} from './activity-dialog-model'
import {TimelineService} from '../../services/timeline.service'
import {Time, TimeRange} from '../timetable/model/time-model'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {TimetablePreviewService} from '../../services/timetable-preview.service'

@Component({
  selector: 'app-activity-add-dialog',
  templateUrl: './activity-add-dialog.html',
  styleUrls: ['./activity-add-dialog.scss']
})
export class ActivityAddDialog {
  _timeOptions: string[]

  form: FormGroup

  constructor(
    public dialogRef: MatDialogRef<ActivityAddDialog>,
    @Inject(MAT_DIALOG_DATA) private initialData: ActivityAddDialogData,
    private readonly _timelineService: TimelineService,
    private readonly _previewService: TimetablePreviewService) {

    this._timeOptions = _timelineService.createTimeline(_timelineService.previewPrecision).map(t => t.toString())

    this.form = new FormGroup({
      title: new FormControl<string>(initialData.slot.title, [
        Validators.required,
      ]),
      timeRangeStart: new FormControl<Time>(initialData.slot.timeRange.start),
      timeRangeEnd: new FormControl<Time>(initialData.slot.timeRange.end),
    })
  }

  get title() {
    return this.form.controls.title as FormControl
  }

  get timeRangeStart() {
    return this.form.controls.timeRangeStart as FormControl
  }

  get timeRangeEnd() {
    return this.form.controls.timeRangeEnd as FormControl
  }

  updateInitialData($event: any) {
    this.initialData.slot.title = this.title.value
    this.initialData.slot.timeRange = new TimeRange(
      Time.parse(this.timeRangeStart.value),
      Time.parse(this.timeRangeEnd.value))

    this._previewService.setPreview(this.initialData.slot)
  }

  submit() {
    this.updateInitialData(null)
    this.dialogRef.close(new ActivityAddDialogResult(this.initialData.slot))
  }

  convertToTime(value: any): Time {
    return Time.parse(value)
  }
}
