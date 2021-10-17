import {Component, ElementRef, Input, NgZone, OnInit, ViewChild} from '@angular/core'
import {DateAdapter} from '../../core/date-adapter'
import {DateRange, NavDateSelectionModel} from '../date-navigator/date-selection-model'
import {Subscription} from 'rxjs'
import {SlotSelectionModel, Time} from './slot-selection-model'

export class TimetableDay<D = any> {
  constructor(public value: number,
              public title: string,
              public weekday: { long: string, narrow: string },
              public datekey: number,
              public rawValue?: D) {
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
    this._buildTimeline()
  }
  private _daysCoverage: Array<TimetableDay<D>> | null

  constructor(private _dateAdapter: DateAdapter<D>,
              private _navModel: NavDateSelectionModel<D>,
              private _slotsModel: SlotSelectionModel<D>,
              private _elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
    _ngZone.runOutsideAngular(() => {
        const element = _elementRef.nativeElement
        element.addEventListener('mousedown', this._cellMouseDown.bind(this), true)
        // element.addEventListener('mouseup', this._cellMouseUp, true)
        // element.addEventListener('mouseover', this._cellMouseOver, true)
        // element.addEventListener('mouseleave', this._cellMouseLeave, true)
      }
    )
    this._registerModel(_navModel)
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
    while (this._dateAdapter.getHour(startTimeline) !== 23) {
      startTimeline = this._dateAdapter.addCalendarTime(startTimeline, this.timestep, 'minutes')
      scale.push(startTimeline)
    }

    this._timePoints = scale.map(time => {
      return new Time(this._dateAdapter.getHour(time), this._dateAdapter.getMinute(time))
    })
  }

  _initDaysCoverage(selection: D | DateRange<D>) {
    const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow')
    const longWeekdays = this._dateAdapter.getDayOfWeekNames('long')
    const weekdays = longWeekdays.map((long, i) => {
      return {long, narrow: narrowWeekdays[i]}
    })

    if (selection instanceof DateRange) {
      const range = selection as DateRange<D>
      this.daysCoverage = this._dateAdapter.toArray(range.start, range.end)
        .map(day => new TimetableDay<D>(
          this._dateAdapter.getDate(day),
          this._dateAdapter.format(day, 'DD'),
          weekdays[this._dateAdapter.getDayOfWeek(day)],
          this._dateAdapter.getDateKey(day),
          day
        ))
    } else {
      const day = selection as D
      this.daysCoverage = [
        new TimetableDay<D>(
          this._dateAdapter.getDate(day),
          this._dateAdapter.format(day, 'DD'),
          weekdays[this._dateAdapter.getDayOfWeek(day)],
          this._dateAdapter.getDateKey(day),
          day)
      ]
    }
  }

  ngOnInit(): void {
  }

  _cellMouseDown(event) {
    const dateKey = event.target.getAttribute('data-datekey')
    if (dateKey) {
      // this._dateAdapter.getDateByKey(dateKey)
      // console.log(this._getTime(event.clientY).toString())
    }
  }

  _getTime(clientY: number, precision: number = DEFAULT_SLOT_PRECISION): Time | null {
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
