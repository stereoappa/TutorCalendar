import {Component, Inject} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {ActivityAddDialogData, ActivityAddDialogResult} from './activity-dialog-model'

@Component({
  selector: 'app-activity-add-dialog',
  templateUrl: './activity-add-dialog.html',
  styleUrls: ['./activity-add-dialog.scss']
})
export class ActivityAddDialog {

  constructor(
    public dialogRef: MatDialogRef<ActivityAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityAddDialogData) {
  }

  timeChanged($event: any) {
    console.log('time changed', $event)
  }

  cancel(): void {
    this.dialogRef.close()
  }

  save() {
    this.dialogRef.close(new ActivityAddDialogResult(this.data.slot))
  }
}
