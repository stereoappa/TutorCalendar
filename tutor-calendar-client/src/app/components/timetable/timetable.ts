import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core'
import {Time, TimeRange} from './model/time-model'
import {ColumnDay, Slot, TimetableColumnActionEventArgs} from './timetable-column'
import {TimetablePreviewService} from './model/timetable-preview.service'
import {MatDialog} from '@angular/material/dialog'
import {ActivityAddDialog} from './activity-add-dialog/activity-add-dialog'
import {ActivityAddDialogData, ActivityAddDialogResult} from './activity-add-dialog/activity-dialog-model'
import {TimelineService} from '../../services/timeline.service'

export interface TimetableUserEvent<T> {
  args: T
  event: Event
}

const MINUTES_PER_HOUR = 60

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.scss']
})
export class Timetable<D> implements OnInit {

  @ViewChild('timeline') timelineRef: ElementRef<HTMLElement>

  @ViewChild('columnsContainer') columnsRef: ElementRef<HTMLElement>

  @Input()  columns: ColumnDay<D>[] | null

  @Output() readonly slotCreated = new EventEmitter<TimetableUserEvent<Slot>>()

  timelineBase: Time[]

  private _preview: Slot

  private _previewFixedTime: Time

  constructor(private readonly _timelineService: TimelineService,
              private readonly _previewService: TimetablePreviewService,
              private dialogService: MatDialog) { }

  ngOnInit(): void {
    this.timelineBase = this._timelineService.timelineBase
  }

  private _getTime(clientY: number, precision: number = this._timelineService.slotPrecision): Time | null {
    const timePointsRect = this.timelineRef.nativeElement.getBoundingClientRect()

    const timelineOffsetY = Math.floor(clientY - timePointsRect.top)
    const timePointHeightPx = Math.round(timePointsRect.height / this.timelineBase.length)

    const selectedPointRatio = (timelineOffsetY / timePointHeightPx)

    if (selectedPointRatio < 0) {
      return this.timelineBase[0]
    }

    if (Math.trunc(selectedPointRatio) > this.timelineBase.length - 1) {
      return this._timelineService.maxUnderlineTime
    }

    const selectedTimePoint = this.timelineBase[Math.trunc(selectedPointRatio)]

    const selectedPointMinuteRatio = selectedPointRatio - Math.trunc(selectedPointRatio)
    const selectedMinutes = Math.trunc(selectedPointMinuteRatio % 1 * this._timelineService.timestep)

    const selectedTime = selectedTimePoint.addMinutes(selectedMinutes)

    const selectedMinutesWithPrecision = Math.trunc(selectedTime.minute / precision) * precision

    return new Time(selectedTime.hour, selectedMinutesWithPrecision)
  }

  private _getTopOffset(time: Time): number {
    const timePointsRect = this.timelineRef.nativeElement.getBoundingClientRect()

    const timePointHeightPx = Math.round(timePointsRect.height / this.timelineBase.length)

    const minutesOffset = (time.hour - this.timelineBase[0].hour) * MINUTES_PER_HOUR + time.minute

    const offsetPx = minutesOffset * timePointHeightPx / this._timelineService.timestep

    return offsetPx
  }

  async _previewChanged(event: TimetableUserEvent<TimetableColumnActionEventArgs>) {
    const precisionTime = this._getTime(event.args.clientY, this._timelineService.previewPrecision)

    if (event.args.action === 'selection') {
      this._updatePreview(event.args.datekey, precisionTime)
      this._previewService.init(this.columns.map(c => c.datekey), this.columnsRef)
      this._previewService.setPreview(this._preview)
      return
    }

    let dialogResult: ActivityAddDialogResult

    if (event.args.action === 'click') {
      this._updatePreview(event.args.datekey, precisionTime)
      this._updatePreview(event.args.datekey, precisionTime.addMinutes(this._timelineService.slotPrecision))
      this._previewService.init(this.columns.map(c => c.datekey), this.columnsRef)
      this._previewService.setPreview(this._preview)
      const slotPreview = this._getPreviewResult(event.args.datekey)
      dialogResult = await this._openActivityAddModalWindow({ slot: slotPreview })
    }

    if (event.args.action === 'selectionEnd') {
      const slotPreview = this._getPreviewResult(event.args.datekey)
      dialogResult = await this._openActivityAddModalWindow({ slot: slotPreview })
    }

    if (dialogResult) {
      this.slotCreated.emit({
        args: dialogResult.slot,
        event: event.event
      })
    }

    this._clearPreview()
  }

  private _updatePreview(datekey: number, time: Time) {
    const preview = this._preview ?? new Slot(
      '',
      TimeRange.empty,
      null)

    this._previewFixedTime = this._previewFixedTime ?? time

    const directionAsc = this._previewFixedTime.toCompareValue() < preview.timeRange.end?.toCompareValue()

    preview.timeRange = new TimeRange(
      this._previewFixedTime,
      time)

    const startOffset = directionAsc ?
      preview.position?.top :
      this._getTopOffset(preview.timeRange.start)

    const height = this._getTopOffset(preview.timeRange.end) - startOffset

    preview.position = {
      datekey,
      top: startOffset,
      height
    }

    this._preview = preview
  }

  private _getPreviewResult(dateKey: number): Slot {
    return this._previewService.getPreview(dateKey)
  }

  private _clearPreview() {
    this._preview = null
    this._previewFixedTime = null
    this._previewService.resetPreview()
  }

  private async _openActivityAddModalWindow(data: ActivityAddDialogData): Promise<ActivityAddDialogResult> {
    const dialogRef = this.dialogService.open(ActivityAddDialog, {
      panelClass: 'dialog-container',
      data
    })

    return await dialogRef.afterClosed()
      .toPromise()
      .then(result => {
        return Promise.resolve(result)
      })
  }
}
