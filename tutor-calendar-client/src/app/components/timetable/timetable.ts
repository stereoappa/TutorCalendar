import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core'
import {Time} from './model/time-model'
import {ColumnDay, Slot, TimetableColumnActionEventArgs} from './timetable-column'
import {TimetablePreviewService} from '../../services/timetable-preview.service'
import {ActivityAddDialog} from '../activity-add-dialog/activity-add-dialog'
import {ActivityAddDialogData, ActivityAddDialogResult} from '../activity-add-dialog/activity-dialog-model'
import {TimelineService} from '../../services/timeline.service'
import {ModalService} from '../../services/modal.service'

export interface TimetableUserEvent<T> {
  args: T
}

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.scss']
})
export class Timetable<D> implements AfterViewInit {

  @ViewChild('timeline') timelineRef: ElementRef<HTMLElement>

  @ViewChild('columnsContainer') columnsContainerRef: ElementRef<HTMLElement>

  @Input()
  get columns() {
    return this._columns
  }
  set columns(val: ColumnDay<D>[] | null) {
    this._columns = val
    this._previewService.bind(this._columns?.map(c => c.datekey) ?? [], this.columnsContainerRef, this.timelineRef)
  }
  _columns: ColumnDay<D>[] | null

  @Output() readonly slotCreated = new EventEmitter<TimetableUserEvent<Slot>>()

  get mainTimeline(): Time[] {
    return this._timelineService.mainTimeline
  }

  constructor(private readonly _timelineService: TimelineService,
              private readonly _previewService: TimetablePreviewService,
              private dialogService: ModalService) {
  }

  ngAfterViewInit() {
    this._previewService.bind(this._columns?.map(c => c.datekey) ?? [], this.columnsContainerRef, this.timelineRef)
  }

  _previewChanged(event: TimetableUserEvent<TimetableColumnActionEventArgs>) {
    const adjustedTime = this._timelineService.getTimeByTopOffset(
      this.timelineRef,
      event.args.clientY,
      this._timelineService.previewPrecision)

    if (event.args.action === 'selection') {
      this._previewService.drawPreview(event.args.datekey, adjustedTime)
      return
    }

    if (event.args.action === 'click') {
      this._previewService.drawPreview(event.args.datekey, adjustedTime)
      this._previewService.drawPreview(event.args.datekey, adjustedTime.addMinutes(this._timelineService.slotPrecision))
      const slotPreview = this._previewService.getPreview(event.args.datekey)
      this._openActivityAddDialog({slot: slotPreview})
    }

    if (event.args.action === 'selectionEnd') {
      const slotPreview = this._previewService.getPreview(event.args.datekey)
      this._openActivityAddDialog({slot: slotPreview})
    }
  }

  private _openActivityAddDialog(data: ActivityAddDialogData): void {
    const dialogRef = this.dialogService.open(ActivityAddDialog, data)

    dialogRef.afterClosed()
      .subscribe((dialogResult: ActivityAddDialogResult) => {
        if (dialogResult) {
          this.slotCreated.emit({
            args: dialogResult.slot,
          })
        }
        this._previewService.cleanupPreview()
      })
  }
}
