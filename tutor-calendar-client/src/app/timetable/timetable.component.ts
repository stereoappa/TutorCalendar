import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core'
import {Time, TimeRange} from './time-model'
import {ColumnDay, ISlotPosition, Slot, TimetableColumnActionEventArgs} from './timetable-column.component'
import {TimetablePreviewService} from './timetable-preview.service'

export interface TimetableUserEvent<T> {
  args: T
  event: Event
}

const MINUTES_PER_HOUR = 60

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent<D> implements OnInit {

  @ViewChild('timeline') timelineRef: ElementRef<HTMLElement>

  @ViewChild('columnsContainer') columnsRef: ElementRef<HTMLElement>

  @Input() timestep: number = 60

  @Input() columns: ColumnDay<D>[] | null

  @Input() startTimeline: Time

  @Input() endTimeline: Time

  @Output() readonly slotCreated = new EventEmitter<TimetableUserEvent<Slot>>()

  timePoints: Time[]

  private _preview: Slot

  private _maxAvailableTime: Time

  get slotPrecision(): number {
    return this.timestep / 2
  }

  get previewPrecision(): number {
    return this.timestep / 4
  }

  constructor(private readonly _previewService: TimetablePreviewService) { }

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

  private _previewChanged(event: TimetableUserEvent<TimetableColumnActionEventArgs>) {
    const precisionTime = this._getTime(event.args.clientY, this.previewPrecision)
    const precisionTopOffset = this._getTopOffset(precisionTime)

    if (event.args.action === 'click') { }

    if (event.args.action === 'selection') {
      const position: ISlotPosition = {
        datekey: event.args.datekey,
        top: this._preview?.position?.top || precisionTopOffset,
        height: precisionTopOffset - this._preview?.position?.top
      }

      this._preview = this._preview ?? new Slot(
        '(Новое событие)',
        TimeRange.empty,
        position)

      this._preview.timeRange = new TimeRange(this._preview.timeRange.start || precisionTime, precisionTime)
      this._preview.position = position

      this._startPreview()
    }

    if (event.args.action === 'selectionEnd') {
      const slot = this._getSlotPreview(event.args.datekey)

      this.slotCreated.emit({
        args: slot,
        event: event.event
      })
    }
  }

  private _startPreview() {
    this._previewService.setPreview(this._preview, this.columns.map(c => c.datekey), this.columnsRef)
  }

  private _getSlotPreview(dateKey: number): Slot {
    this._preview = null
    return this._previewService.getPreview(dateKey)
  }
}
