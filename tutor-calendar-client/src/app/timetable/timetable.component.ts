import {Component, ElementRef, Input, NgZone, OnInit, ViewChild} from '@angular/core'
import {DateAdapter} from '../../core/date-adapter'
import {DateRange, NavDateSelectionModel} from '../date-navigator/date-selection-model'
import {Subscription} from 'rxjs'
import {TimeSelectionModel, Time, TimeRange} from './time-selection-model'

export class TimetableDay<D = any> {
  constructor(public value: number,
              public title: string,
              public weekday: { long: string, narrow: string },
              public datekey: number,
              public rawValue: D,
              public slots: Slot[] = [],
              public preview?: Slot | null) {
  }
}

interface ISlotPositionStyles {
  top: string
  height: string
}

export class Slot {
  constructor(readonly title: string | null,
              readonly timeRangeTitle: string | null,
              readonly positionStyles: ISlotPositionStyles) {
  }
}

const DEFAULT_TIMESTEP = 60

const DEFAULT_SLOT_PRECISION = DEFAULT_TIMESTEP / 2

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent<D> implements OnInit {
  private _valueChangesSubscription = Subscription.EMPTY

  _timePoints: Time[]

  _previewTimeRange: TimeRange | null

  @ViewChild('timeline') timeline: ElementRef<HTMLElement>

  @Input()
  get timestep(): number {
    return this._timestep ?? DEFAULT_TIMESTEP
  }

  set timestep(value: number) {
    this._timestep = value
    this._buildTimeline()
  }

  private _timestep: number

  @Input()
  get daysCoverage(): Array<TimetableDay<D>> | null {
    return this._daysCoverage
  }
  set daysCoverage(value: Array<TimetableDay<D>> | null) {
    this._daysCoverage = value
  }
  private _daysCoverage: Array<TimetableDay<D>> | null

  constructor(private _dateAdapter: DateAdapter<D>,
              private _dateSelectionModel: NavDateSelectionModel<D>,
              private _timeSelectionModel: TimeSelectionModel,
              private _elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
    _ngZone.runOutsideAngular(() => {
        const element = _elementRef.nativeElement
        element.addEventListener('mousedown', this._cellMouseDown.bind(this), true)
        element.addEventListener('mouseup', this._cellMouseUp.bind(this), true)
        // element.addEventListener('mouseover', this._cellMouseOver.bind(this), true)
        // element.addEventListener('mouseleave', this._cellMouseLeave, true)
      }
    )
    this._registerModel(_dateSelectionModel)
  }

  ngOnInit(): void {
    this._buildTimeline()
    if (!this.daysCoverage) {
      this.daysCoverage = [this._createTimeTableDay(this._dateAdapter.today())]
    }
  }

  _registerModel(model: NavDateSelectionModel<D>): void {
    this._valueChangesSubscription.unsubscribe()
    this._valueChangesSubscription = model.selectionChanged.subscribe(event => this._initDaysCoverage(event.selection))
  }

  _buildTimeline() {
    const today = this._dateAdapter.today()
    let startTimeline = this._dateAdapter.createDate(
      this._dateAdapter.getYear(today),
      this._dateAdapter.getMonth(today),
      this._dateAdapter.getDate(today),
      7, 0, 0)

    let scale: D[] = [startTimeline]
    while (this._dateAdapter.getHour(startTimeline) < 23) {
      startTimeline = this._dateAdapter.addCalendarTime(startTimeline, this.timestep, 'minutes')
      scale.push(startTimeline)
    }

    this._timePoints = scale.map(time => {
      return new Time(this._dateAdapter.getHour(time), this._dateAdapter.getMinute(time))
    })
  }

  _initDaysCoverage(selection: D | DateRange<D>) {
    if (selection instanceof DateRange) {
      const range = selection as DateRange<D>
      this.daysCoverage =
        this._dateAdapter.toArray(range.start, range.end)
          .map(day => this._createTimeTableDay(day))
    } else {
      const day = selection as D
      this.daysCoverage = [this._createTimeTableDay(day)]
    }
  }

  _createTimeTableDay(day: D) {
    const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow')
    const longWeekdays = this._dateAdapter.getDayOfWeekNames('long')
    const weekdays = longWeekdays.map((long, i) => {
      return {long, narrow: narrowWeekdays[i]}
    })

    return new TimetableDay<D>(
      this._dateAdapter.getDate(day),
      this._dateAdapter.format(day, 'DD'),
      weekdays[this._dateAdapter.getDayOfWeek(day)],
      this._dateAdapter.getDateKey(day),
      day,
      [])
  }

  _getSlots(day: TimetableDay<D>) {
    const coverageDay = this.daysCoverage.find(d => d.datekey === day.datekey)
    if (coverageDay) {
      coverageDay.slots = this._timeSelectionModel.selectionComplete ?
        coverageDay.slots :
        [...coverageDay.slots, coverageDay.preview]
    }
  }

  private _cellMouseDown(event) {
    const dateKey = event.target.getAttribute('data-datekey')
    if (dateKey) {
      if (this._dateAdapter.getDateByKey(dateKey)) {
        this._timeSelectionModel.previewStart(dateKey, this._getTime(event.clientY))

        this._ngZone.runOutsideAngular(() => {
          const element = this._elementRef.nativeElement
          element.addEventListener('mousemove', this._cellMouseOver.bind(this), true)
        })
      }
    }
  }

  private _cellMouseOver(event) {
    console.log(event.clientY)
    this._timeSelectionModel.previewUpdate(this._getTime(event.clientY))
  }

  private _cellMouseUp(event) {
    if (!this._timeSelectionModel.selectionComplete) {
      const preview = this._timeSelectionModel.getSelection()
      const coverageDay = this._getCoverageDay(preview.dateKey)
      if (coverageDay) {

        this._ngZone.runOutsideAngular(() => {
          const element = this._elementRef.nativeElement
          element.removeEventListener('mousemove', this._cellMouseOver, true)
        })

        coverageDay.slots = [
          ...coverageDay.slots,
          new Slot('(new)', preview.timeRange.toString(), this._calculatePositionStyle(preview.timeRange))]
      }
    }
  }

  private _getCoverageDay(dateKey: number) {
    if (!dateKey) {
      return null
    }

    const day = this._dateAdapter.getDateByKey(dateKey)
    return this._daysCoverage.find(d => this._dateAdapter.sameDate(d.rawValue, day)) ?? null
  }

  private _calculatePositionStyle(timeRange: TimeRange): ISlotPositionStyles {
    const timePointsRect = this.timeline.nativeElement.getBoundingClientRect()
    const timePointHeightPx = Math.round(timePointsRect.height / this._timePoints.length)

    const selectedTimePoint = this._timePoints.findIndex(p => p.hour === timeRange.start.hour)
    return {top: '100px', height: '100px'}
  }

  private _getTime(clientY: number, precision: number = DEFAULT_SLOT_PRECISION): Time | null {
    const timePointsRect = this.timeline.nativeElement.getBoundingClientRect()

    const timelineOffsetY = Math.floor(clientY - timePointsRect.top)
    const timePointHeightPx = Math.round(timePointsRect.height / this._timePoints.length)

    const selectedPointRatio = (timelineOffsetY / timePointHeightPx)
    const selectedTimePoint = this._timePoints[Math.trunc(selectedPointRatio)]

    const selectedPointMinuteRatio = selectedPointRatio - Math.trunc(selectedPointRatio)
    const selectedMinutes = Math.trunc(selectedPointMinuteRatio % 1 * this.timestep)

    const selectedTime = selectedTimePoint.addMinutes(selectedMinutes)

    const selectedMinutesWithPrecision = Math.trunc(selectedTime.minute / precision) * precision

    return new Time(selectedTime.hour, selectedMinutesWithPrecision)
  }
}
