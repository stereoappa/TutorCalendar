import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ActivityAddDialogData, ActivityAddDialogResult} from "../timetable/activity-add-dialog/activity-dialog-model";
import {TimelineService} from "../../services/timeline.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent<TComponent, TData> implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TComponent>,
    @Inject(MAT_DIALOG_DATA) private initialData: TData) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close()
  }

  save() {
    this.dialogRef.close(this.initialData)
  }
}
