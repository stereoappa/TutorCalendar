import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges, OnDestroy,
  Optional,
  SimpleChanges
} from '@angular/core'
import {DateAdapter} from '../../../core/date-adapter'
import {DateRange, DateSelectionService} from '../../services/date-selection-service'
import {NavCalendarCell, NavCalendarUserEvent} from './nav-calendar-body'
import {DateFormats, NAV_DATE_FORMATS} from '../../../core/date-formats'
import {Subscription} from 'rxjs'

const DAYS_PER_WEEK = 7

@Component({
  selector: 'app-nav-calendar',
  templateUrl: './nav-calendar.html',
  styleUrls: ['./nav-calendar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavCalendar<D> implements AfterContentInit, OnChanges, OnDestroy {
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

  _weeks: NavCalendarCell[][]

  _firstWeekOffset: number

  _lastWeekOffset: number

  _rangeStart: number | null

  _rangeEnd: number | null

  _previewStart: number | null

  _previewEnd: number | null

  _isRange: boolean

  _todayDate: number | null

  _weekdays: { long: string, narrow: string }[]

  private _dateNavigatorSelectionChangedSubscription = Subscription.EMPTY

  constructor(private dateSelectionService: DateSelectionService<D>,
              @Optional() public _dateAdapter: DateAdapter<D>,
              @Optional() @Inject(NAV_DATE_FORMATS) private _dateFormats: DateFormats) {
    this.subscribeOnSelectionChanged()
  }

  private subscribeOnSelectionChanged(): void {
    this._dateNavigatorSelectionChangedSubscription.unsubscribe()
    this._dateNavigatorSelectionChangedSubscription = this.dateSelectionService.selectionChanged.subscribe(event => {
      this.selectDateRangeCells(event.dateRange)
    })
  }

  ngAfterContentInit(): void {
    console.log((this.dateSelectionService.selection as D) ?? (this.dateSelectionService.selection as DateRange<D>).start)
    this.activeDate = (this.dateSelectionService.selection as D) ?? (this.dateSelectionService.selection as DateRange<D>).start
    this._init()
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  _init(): void {
    this._monthLabel = this._dateFormats.display.monthYearA11yLabel
      ? this._dateAdapter.format(this.activeDate, this._dateFormats.display.monthYearA11yLabel)
      : this._dateAdapter.getMonthNames('long')[this._dateAdapter.getMonth(this.activeDate)]

    const firstOfMonth = this._dateAdapter.createDate(
      this._dateAdapter.getYear(this.activeDate),
      this._dateAdapter.getMonth(this.activeDate), 1)

    const firstOfNextMonth = this._dateAdapter.addCalendarMonths(firstOfMonth, 1)

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
      if (i < this._firstWeekOffset || i >= this._firstWeekOffset + daysInMonth) {
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
    const selectedDate = this._dateAdapter.parse(event.args)
    this._previewStart = this._previewEnd = null

    this.dateSelectionService.updateSelection(selectedDate, this)
  }

  _previewChanged(event: NavCalendarUserEvent<NavCalendarCell<D> | null>) {
    if (!event.selectionComplete) {
      if (!this._previewStart) {
        this._previewStart = this._getCellCompareValue(event.args.rawValue)
        return
      }

      this._previewEnd = this._getCellCompareValue(event.args.rawValue)
      this.selectDateRangeCells(this.createPreviewDateRange())

      return
    }

    this._previewEnd = this._getCellCompareValue(event.args.rawValue)

    this.dateSelectionService.updateSelection(this.createPreviewDateRange(), this)

    this._previewStart = this._previewEnd = null
  }

  private createPreviewDateRange(): DateRange<D> {
    return new DateRange<D>(
      this._dateAdapter.parse(this._previewStart),
      this._dateAdapter.parse(this._previewEnd)
    )
  }

  private _hasSameMonthAndYear(d1: D | null, d2: D | null): boolean {
    return !!(d1 && d2 && this._dateAdapter.getMonth(d1) === this._dateAdapter.getMonth(d2) &&
      this._dateAdapter.getYear(d1) === this._dateAdapter.getYear(d2))
  }

  private selectDateRangeCells(selectedValue: DateRange<D> | D | null): void {
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

  ngOnDestroy(): void {
    this._dateNavigatorSelectionChangedSubscription.unsubscribe()
  }
}

