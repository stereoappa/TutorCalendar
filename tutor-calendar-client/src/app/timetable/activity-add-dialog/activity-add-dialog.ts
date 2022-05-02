import {Component, Inject} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {ActivityAddDialogData, ActivityAddDialogResult} from './activity-dialog-model'
import {Slot} from '../timetable-column'

@Component({
  selector: 'app-activity-add-dialog',
  templateUrl: './activity-add-dialog.html',
  styleUrls: ['./activity-add-dialog.scss']
})
export class ActivityAddDialog {
  _data: Slot

  constructor(
    public dialogRef: MatDialogRef<ActivityAddDialog>,
    @Inject(MAT_DIALOG_DATA) private initialData: ActivityAddDialogData) {
    this._data = initialData.slot.copy()
    console.log(this._data)
  }

  updateInitialData() {
    this.initialData.slot.title = this._data.title
    this.initialData.slot.timeRange.start = this._data.timeRange.start
    this.initialData.slot.timeRange.end = this._data.timeRange.end
  }

  cancel(): void {
    this.dialogRef.close()
  }

  save() {
    this.updateInitialData()
    this.dialogRef.close(new ActivityAddDialogResult(this.initialData.slot))
  }

  private _isValidTime($event: any) {
    return true
  }


  getTitle() {
    return this._data.title
  }
}
