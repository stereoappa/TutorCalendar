import {Component, ElementRef, Input, NgZone, OnInit, ViewChild} from '@angular/core'
import {DateAdapter} from '../../core/date-adapter'
import {DateRange} from '../date-navigator/date-selection-model'
import {PreviewSelectionModel, Time, TimeRange} from './preview-selection-model.service'

export class ColumnDay<D = any> {
  constructor(public value: number,
              public title: string,
              public weekday: { long: string, narrow: string },
              public datekey: number,
              public rawValue: D,
              public slots: Slot[] = []) {
  }
}

export interface ISlotPosition {
  top: number,
  height: number
}

export class Slot {
  constructor(readonly title: string | null,
              readonly subTitle: string | null,
              readonly position: ISlotPosition) {
  }
}

const DEFAULT_TIMESTEP = 60

const DEFAULT_SLOT_PRECISION = DEFAULT_TIMESTEP / 2

const DEFAULT_SLOT_PREVIEW_PRECISION = DEFAULT_SLOT_PRECISION / 2

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent<D> implements OnInit {

  @ViewChild('timeline') timeline: ElementRef<HTMLElement>

  @Input()
  get days(): D | DateRange<D | null> {
    return this._days
  }
  set days(value: D | DateRange<D> | null) {
    this._days = value
    this._initColumns()
  }
  private _days: D | DateRange<D> | null

  @Input()
  get timestep(): number {
    return this._timestep ?? DEFAULT_TIMESTEP
  }
  set timestep(value: number) {
    this._timestep = value
    this._buildTimeline()
  }
  private _timestep: number

  timePoints: Time[]

  columns: ColumnDay<D>[] | null

  constructor(private _dateAdapter: DateAdapter<D>,
              private _previewSelectionModel: PreviewSelectionModel,
              private _elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
  }

  ngOnInit(): void { }

  _buildTimeline() {
    const today = this._dateAdapter.today()
    let startTimeline = this._dateAdapter.createDate(
      this._dateAdapter.getYear(today),
      this._dateAdapter.getMonth(today),
      this._dateAdapter.getDate(today),
      7, 0, 0)

    const scale: D[] = [startTimeline]
    while (this._dateAdapter.getHour(startTimeline) < 23) {
      startTimeline = this._dateAdapter.addCalendarTime(startTimeline, this.timestep, 'minutes')
      scale.push(startTimeline)
    }

    this.timePoints = scale.map(time => {
      return new Time(this._dateAdapter.getHour(time), this._dateAdapter.getMinute(time))
    })
  }

  _initColumns() {
    if (!this.days) {
      this.columns = [this._toColumnDay(this._dateAdapter.today())]
    }

    if (this.days instanceof DateRange) {
      const range = this.days as DateRange<D>
      this.columns =
        this._dateAdapter
          .toArray(range.start, range.end)
          .map(day => this._toColumnDay(day))
    } else {
      const day = this.days as D
      this.columns = [this._toColumnDay(day)]
    }
  }

  _toColumnDay(day: D): ColumnDay<D> {
    const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow')
    const longWeekdays = this._dateAdapter.getDayOfWeekNames('long')
    const weekdays = longWeekdays.map((long, i) => {
      return {long, narrow: narrowWeekdays[i]}
    })

    return new ColumnDay<D>(
      this._dateAdapter.getDate(day),
      this._dateAdapter.format(day, 'DD'),
      weekdays[this._dateAdapter.getDayOfWeek(day)],
      this._dateAdapter.getDateKey(day),
      day,
      [new Slot('sdf', 'sdf', {top: 100, height: 100})])
  }

  private _getColumn(dateKey: number) {
    if (!dateKey) {
      return null
    }
    const day = this._dateAdapter.getDateByKey(dateKey)
    return this.columns.find(d => this._dateAdapter.sameDate(d.rawValue, day)) ?? null
  }

  private _calculatePositionStyle(timeRange: TimeRange): ISlotPosition {
    const timePointsRect = this.timeline.nativeElement.getBoundingClientRect()
    const timePointHeightPx = Math.round(timePointsRect.height / this.timePoints.length)

    const selectedTimePoint = this.timePoints.findIndex(p => p.hour === timeRange.start.hour)
    return {top: 100, height: 100}
  }

  private _getTime(clientY: number, precision: number = DEFAULT_SLOT_PRECISION): Time | null {
    const timePointsRect = this.timeline.nativeElement.getBoundingClientRect()

    const timelineOffsetY = Math.floor(clientY - timePointsRect.top)
    const timePointHeightPx = Math.round(timePointsRect.height / this.timePoints.length)

    const selectedPointRatio = (timelineOffsetY / timePointHeightPx)
    const selectedTimePoint = this.timePoints[Math.trunc(selectedPointRatio)]

    const selectedPointMinuteRatio = selectedPointRatio - Math.trunc(selectedPointRatio)
    const selectedMinutes = Math.trunc(selectedPointMinuteRatio % 1 * this.timestep)

    const selectedTime = selectedTimePoint.addMinutes(selectedMinutes)

    const selectedMinutesWithPrecision = Math.trunc(selectedTime.minute / precision) * precision

    return new Time(selectedTime.hour, selectedMinutesWithPrecision)
  }
}
