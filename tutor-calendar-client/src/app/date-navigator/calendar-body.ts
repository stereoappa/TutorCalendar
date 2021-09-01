import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core'

export class NavCalendarCell<D = any> {
  constructor(public value: number,
              public compareValue: number,
              public displayValue: string,
              public enabled: boolean,
              public cssClasses,
              public rawValue?: D) {}
}

export interface NavCalendarUserEvent<D> {
  value: D
  event: Event
}

@Component({
  selector: 'app-nav-calendar-body',
  templateUrl: 'calendar-body.html',
  styleUrls: ['calendar-body.scss']
})
export class CalendarBodyComponent  {
  @Input() label: string

  @Input() rows: NavCalendarCell[][]

  @Input() weekdays: {long: string, narrow: string}[]

  @Input() activeCell = 0

  @Input() isRange = false

  @Input() startValue: number

  @Input() endValue: number

  @Input() todayValue: number

  @Output() readonly selectedValueChange = new EventEmitter<NavCalendarUserEvent<number> | null>()

  constructor(private _elementRef: ElementRef<HTMLElement>) {
    const element = _elementRef.nativeElement
  }

  _cellClicked(cell: NavCalendarCell, event: MouseEvent): void {
    if (cell.enabled) {
      this.selectedValueChange.emit({value: cell.value, event})
    }
  }

  _isRangeStart(value: number): boolean {
    return isStart(value, this.startValue, this.endValue)
  }

  _isRangeEnd(value: number): boolean {
    return isEnd(value, this.startValue, this.endValue)
  }

  _isInRange(value: number): boolean {
    return isInRange(value, this.startValue, this.endValue, this.isRange)
  }

  _isActiveCell(rowIndex: number, colIndex: number): boolean {
    const cellNumber = rowIndex * 7 + colIndex
    return cellNumber === this.activeCell
  }
}

function isStart(value: number, start: number | null, end: number | null): boolean {
  return end !== null && start !== end && value < end && value === start
}

function isEnd(value: number, start: number | null, end: number | null): boolean {
  return start !== null && start !== end && value >= start && value === end
}

function isInRange(value: number,
                   start: number | null,
                   end: number | null,
                   rangeEnabled: boolean): boolean {
  return rangeEnabled && start !== null && end !== null && start !== end &&
    value >= start && value <= end
}
