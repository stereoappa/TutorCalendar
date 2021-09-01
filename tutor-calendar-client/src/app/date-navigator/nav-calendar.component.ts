import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Inject,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges
} from '@angular/core'
import {DateAdapter} from '../../core/date-adapter'
import {DateRange} from './date-selection-model'
import {NavCalendarCell, NavCalendarUserEvent} from './calendar-body'
import {DateFormats, NAV_DATE_FORMATS} from '../../core/date-formats'

const DAYS_PER_WEEK = 7

@Component({
  selector: 'app-nav-calendar',
  templateUrl: './nav-calendar.component.html',
  styleUrls: ['./nav-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // host: {
  //   'class': 'mat-calendar',
  // }
})

export class NavCalendarComponent<D> implements AfterContentInit, OnChanges {
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

  @Output() readonly _userSelection: EventEmitter<NavCalendarUserEvent<D | null>> =
    new EventEmitter<NavCalendarUserEvent<D | null>>()

  private _activeDate: D

  _monthLabel: string

  _weeks: NavCalendarCell[][]

  _firstWeekOffset: number

  _lastWeekOffset: number

  _rangeStart: number | null

  _rangeEnd: number | null

  _isRange: boolean

  _todayDate: number | null

  _weekdays: { long: string, narrow: string }[]

  constructor(@Optional() public _dateAdapter: DateAdapter<D>,
              @Optional() @Inject(NAV_DATE_FORMATS) private _dateFormats: DateFormats) {
  }

  ngAfterContentInit(): void {
    // this._calendarHeaderPortal = new ...
    this.activeDate = this._dateAdapter.today()
    this._init()
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ON CHANGE!', changes)
  }

  _init(): void {
    this._setRanges(this.selected)
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
        cellClasses.push('today')
      }

      const enabled = true
      const cellValue = this._dateAdapter.getDate(date)

      this._weeks[this._weeks.length - 1].push(new NavCalendarCell<D>(
        cellValue,
        this._getCellCompareValue(date),
        cellValue.toString(),
        enabled,
        cellClasses,
        date))
    }
  }

  previousClicked(): void {
    this.activeDate = this._dateAdapter.addCalendarMonths(this.activeDate, -1)
  }

  nextClicked(): void {
    this.activeDate = this._dateAdapter.addCalendarMonths(this.activeDate, 1)
  }

  _dateSelected(event: NavCalendarUserEvent<number>): void {
    const day = event.value
    const selectedYear = this._dateAdapter.getYear(this.activeDate)
    const selectedMonth = this._dateAdapter.getMonth(this.activeDate)
    const selectedDate = this._dateAdapter.createDate(selectedYear, selectedMonth, day)

    //this.selected = selectedDate
    this._userSelection.emit({value: selectedDate, event: event.event})
  }

  private _hasSameMonthAndYear(d1: D | null, d2: D | null): boolean {
    return !!(d1 && d2 && this._dateAdapter.getMonth(d1) === this._dateAdapter.getMonth(d2) &&
      this._dateAdapter.getYear(d1) === this._dateAdapter.getYear(d2))
  }

  private _setRanges(selectedValue: DateRange<D> | D | null): void {
    if (selectedValue instanceof DateRange) {
      this._rangeStart = this._getCellCompareValue(selectedValue.start)
      this._rangeEnd = this._getCellCompareValue(selectedValue.end)
      this._isRange = true
    } else {
      this._rangeStart = this._rangeEnd = this._getCellCompareValue(selectedValue)
      this._isRange = false
    }
  }

  private _getCellCompareValue(date: D | null): number | null {
    if (date) {
      const year = this._dateAdapter.getYear(date)
      const month = this._dateAdapter.getMonth(date)
      const day = this._dateAdapter.getDate(date)
      return new Date(year, month, day).getTime()
    }

    return null
  }
}

