import {Component, Inject} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {ActivityDialogData} from './activity-dialog-model'

@Component({
  selector: 'app-activity-add-dialog',
  templateUrl: './activity-add-dialog.html',
  styleUrls: ['./activity-add-dialog.scss']
})
export class ActivityAddDialog {

  constructor(
    public dialogRef: MatDialogRef<ActivityAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityDialogData) {
  }

  onCloseClick(): void {
    this.dialogRef.close()
  }
}
