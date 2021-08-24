import {AfterContentInit, ChangeDetectionStrategy, Component, Inject, Input, OnChanges, Optional, SimpleChanges} from '@angular/core'
import {DateAdapter} from '../../core/date-adapter'
import {DateRange} from './date-selection-model'
import {MatCalendarCell} from './calendar-body'
import {DateFormats, NAV_DATE_FORMATS} from '../../core/date-formats'

const DAYS_PER_WEEK = 7

@Component({
  selector: 'app-nav-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // host: {
  //   'class': 'mat-calendar',
  // }
})

export class CalendarComponent<D> implements AfterContentInit, OnChanges {
  @Input()
  get startAt(): D | null {
    return this._startAt
  }
  set startAt(value: D | null) {
    this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value))
  }
  private _startAt: D | null

  @Input()
  get selected(): DateRange<D> | D | null {
    return this._selected
  }
  set selected(value: DateRange<D> | D | null) {
    if (value instanceof DateRange) {
      this._selected = value
    } else {
      this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value))
    }
  }
  private _selected: DateRange<D> | D | null

  @Input()
  get activeDate(): D {
    return this._activeDate
  }
  set activeDate(value: D) {
    const oldActiveDate = this._activeDate
    this._activeDate = value
    if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
      this._init()
    }
  }
  private _activeDate: D

  _monthLabel: string

  _weeks: MatCalendarCell[][]

  _firstWeekOffset: number

  _lastWeekOffset: number

  _rangeStart: number | null

  _rangeEnd: number | null

  _isRange: boolean

  _todayDate: number | null

  _weekdays: { long: string, narrow: string }[]

  constructor(@Optional() public _dateAdapter: DateAdapter<D>,
              @Optional() @Inject(NAV_DATE_FORMATS) private _dateFormats: DateFormats) {
    this.activeDate = this._dateAdapter.today()
  }

  ngAfterContentInit(): void {
    // this._calendarHeaderPortal = new ...
    this._init()
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ON CHANGE!', changes)
  }

  _init(): void {
    // this._setRanges(this.selected)
    this._monthLabel = this._dateFormats.display.monthYearA11yLabel
      ? this._dateAdapter.format(this.activeDate, this._dateFormats.display.monthYearA11yLabel)
      : this._dateAdapter.getMonthNames('long')[this._dateAdapter.getMonth(this.activeDate)]

    const firstOfMonth = this._dateAdapter.createDate(
      this._dateAdapter.getYear(this.activeDate),
      this._dateAdapter.getMonth(this.activeDate), 1)

    const firstOfNextMonth = this._dateAdapter.createDate(
      this._dateAdapter.getYear(this.activeDate),
      this._dateAdapter.getMonth(this.activeDate) + 1,
      1)

    this._firstWeekOffset = (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
      this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK

    this._lastWeekOffset = (DAYS_PER_WEEK - this._dateAdapter.getDayOfWeek(firstOfNextMonth) +
      this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK

    this._initWeekdays()
    this._createWeekCells()
  }

  private _initWeekdays(): void {
    const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek()
    const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow')
    const longWeekdays = this._dateAdapter.getDayOfWeekNames('long')

    const weekdays = longWeekdays.map((long, i) => {
      return {long, narrow: narrowWeekdays[i]}
    })
    this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek))
  }

  private _createWeekCells(): void {
    const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate)
    this._weeks = [[]]

    const firstWeekStart = this._dateAdapter.getStartOfWeek(
      this._dateAdapter.createDate(
        this._dateAdapter.getYear(this.activeDate),
        this._dateAdapter.getMonth(this.activeDate), 1))

    for (let i = 0, cell = 0; i < this._firstWeekOffset + daysInMonth + this._lastWeekOffset; i++, cell++) {
      if (cell === DAYS_PER_WEEK) {
        this._weeks.push([])
        cell = 0
      }

      const date = this._dateAdapter.addCalendarDays(firstWeekStart, i)
      const cellClasses = []

      /** Previous month offset cells */
      if (i < this._firstWeekOffset || i > this._lastWeekOffset + daysInMonth) {
        cellClasses.push('gray-text')
      }

      if (!this._dateAdapter.compareDate(date, this._dateAdapter.today())) {
        cellClasses.push('active')
      }

      const enabled = true
      const cellValue = this._dateAdapter.getDate(date)

      this._weeks[this._weeks.length - 1].push(new MatCalendarCell<D>(cellValue, cellValue.toString(), enabled, cellClasses, date))
    }
  }

  previousClicked(): void {
    this.activeDate = this._dateAdapter.addCalendarMonths(this.activeDate, -1)
  }

  nextClicked(): void {
    this.activeDate = this._dateAdapter.addCalendarMonths(this.activeDate, 1)
  }

  private _hasSameMonthAndYear(d1: D | null, d2: D | null): boolean {
    return !!(d1 && d2 && this._dateAdapter.getMonth(d1) === this._dateAdapter.getMonth(d2) &&
      this._dateAdapter.getYear(d1) === this._dateAdapter.getYear(d2))
  }
}
