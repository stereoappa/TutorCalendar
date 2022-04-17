import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core'
import {Time, TimeRange} from './model/time-model'
import {ColumnDay, Slot, TimetableColumnActionEventArgs} from './timetable-column'
import {TimetablePreviewService} from './model/timetable-preview.service'
import {MatDialog} from '@angular/material/dialog'
import {ActivityAddDialog} from './activity-add-dialog/activity-add-dialog'
import {ActivityAddDialogData, ActivityAddDialogResult} from './activity-add-dialog/activity-dialog-model'

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

  @Input() timestep: number = 60

  @Input()  columns: ColumnDay<D>[] | null

  @Input() startTimeline: Time

  @Input() endTimeline: Time

  @Output() readonly slotCreated = new EventEmitter<TimetableUserEvent<Slot>>()

  timePoints: Time[]

  private _preview: Slot

  private _previewFixedTime: Time

  private _maxAvailableTime: Time

  get slotPrecision(): number {
    return this.timestep / 2
  }

  get previewPrecision(): number {
    return this.timestep / 4
  }

  constructor(private readonly _previewService: TimetablePreviewService,
              private dialogService: MatDialog) { }

  ngOnInit(): void {
    this._createTimePoints()
    this._maxAvailableTime = this.endTimeline.addMinutes(this.timestep)
  }

  _createTimePoints() {
    const scale = [this.startTimeline.clone()]
    const lastTimePoint = () => scale[scale.length - 1]
    while (lastTimePoint().hour < this.endTimeline.hour) {
      scale.push(lastTimePoint().addMinutes(this.timestep))
    }
    this.timePoints = scale
  }

  private _getTime(clientY: number, precision: number = this.slotPrecision): Time | null {
    const timePointsRect = this.timelineRef.nativeElement.getBoundingClientRect()

    const timelineOffsetY = Math.floor(clientY - timePointsRect.top)
    const timePointHeightPx = Math.round(timePointsRect.height / this.timePoints.length)

    const selectedPointRatio = (timelineOffsetY / timePointHeightPx)

    if (selectedPointRatio < 0) {
      return this.timePoints[0]
    }

    if (Math.trunc(selectedPointRatio) > this.timePoints.length - 1) {
      return this._maxAvailableTime
    }

    const selectedTimePoint = this.timePoints[Math.trunc(selectedPointRatio)]

    const selectedPointMinuteRatio = selectedPointRatio - Math.trunc(selectedPointRatio)
    const selectedMinutes = Math.trunc(selectedPointMinuteRatio % 1 * this.timestep)

    const selectedTime = selectedTimePoint.addMinutes(selectedMinutes)

    const selectedMinutesWithPrecision = Math.trunc(selectedTime.minute / precision) * precision

    return new Time(selectedTime.hour, selectedMinutesWithPrecision)
  }

  private _getTopOffset(time: Time): number {
    const timePointsRect = this.timelineRef.nativeElement.getBoundingClientRect()

    const timePointHeightPx = Math.round(timePointsRect.height / this.timePoints.length)

    const minutesOffset = (time.hour - this.startTimeline.hour) * MINUTES_PER_HOUR + time.minute

    const offsetPx = minutesOffset * timePointHeightPx / this.timestep

    return offsetPx
  }

  async _previewChanged(event: TimetableUserEvent<TimetableColumnActionEventArgs>) {
    const precisionTime = this._getTime(event.args.clientY, this.previewPrecision)

    if (event.args.action === 'selection') {
      this._updatePreview(event.args.datekey, precisionTime)
      this._previewService.init(this.columns.map(c => c.datekey), this.columnsRef)
      this._previewService.setPreview(this._preview)
      return
    }

    let dialogResult: ActivityAddDialogResult

    if (event.args.action === 'click') {
      this._updatePreview(event.args.datekey, precisionTime)
      this._updatePreview(event.args.datekey, precisionTime.addMinutes(this.slotPrecision))
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
      '(Новое событие)',
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
      .toPromise<ActivityAddDialogResult>()
      .then(result => {
        return Promise.resolve(result)
      })
  }
}
