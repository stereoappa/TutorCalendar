import {Component, ElementRef, Input, NgZone, OnInit} from '@angular/core'
import {DateAdapter} from '../../core/date-adapter'
import {DateRange, NavDateSelectionModel} from '../date-navigator/date-selection-model'
import {Subscription} from 'rxjs'

export class TimetableDay<D = any> {
  constructor(public value: number,
              public title: string,
              public weekday: { long: string, narrow: string },
              public datekey: number,
              public rawValue?: D) {
  }
}

const DEFAULT_TIMESTEP = 60

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent<D> implements OnInit {
  private _valueChangesSubscription = Subscription.EMPTY

  _timeline: Array<{ time: string }>

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
              private _model: NavDateSelectionModel<D>,
              private _elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
    _ngZone.runOutsideAngular(() => {
        const element = _elementRef.nativeElement
        element.addEventListener('mousedown', this._cellMouseDown.bind(this), true)
        // element.addEventListener('mouseup', this._cellMouseUp, true)
        // element.addEventListener('mouseover', this._cellMouseOver, true)
        // element.addEventListener('mouseleave', this._cellMouseLeave, true)
      }
    )
    this._registerModel(_model)
  }

  _buildTimeline() {
    const today = this._dateAdapter.today()
    let startTimeline = this._dateAdapter.createDate(
      this._dateAdapter.getYear(today),
      this._dateAdapter.getMonth(today),
      this._dateAdapter.getDate(today),
      6, 0, 0)

    let scale: Array<D> = []
    while (this._dateAdapter.getHour(startTimeline) !== 23) {
      startTimeline = this._dateAdapter.addCalendarTime(startTimeline, this.timestep, 'minutes')
      scale.push(startTimeline)
    }

    this._timeline = scale.map(time => {
      return {time: this._dateAdapter.format(time, 'HH:mm')}
    })
  }

  _registerModel(model: NavDateSelectionModel<D>): void {
    this._valueChangesSubscription.unsubscribe()
    this._valueChangesSubscription = model.selectionChanged.subscribe(event => this._setSelection(event.selection))
  }

  _setSelection(selection: D | DateRange<D>) {
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
      this._dateAdapter.getDateByKey(dateKey)
      console.log(event.clientX)
    }
  }
}
