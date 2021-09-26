import {Component, Input, Output, EventEmitter, ElementRef, NgZone, OnDestroy} from '@angular/core'

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
  selectionComplete?: boolean
}

@Component({
  selector: 'app-nav-calendar-body',
  templateUrl: 'calendar-body.html',
  styleUrls: ['calendar-body.scss']
})
export class CalendarBodyComponent implements OnDestroy  {
  @Input() label: string

  @Input() rows: NavCalendarCell[][]

  @Input() weekdays: {long: string, narrow: string}[]

  @Input() activeCell = 0

  @Input() previewStart: number | null = null

  @Input() previewEnd: number | null = null

  @Input() isRange = false

  @Input() startValue: number

  @Input() endValue: number

  @Input() todayValue: number

  @Output() readonly previewChange =
    new EventEmitter<NavCalendarUserEvent<NavCalendarCell | null>>()

  @Output() readonly selectedValueChange =
    new EventEmitter<NavCalendarUserEvent<number> | null>()

  constructor(private _elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
    _ngZone.runOutsideAngular(() => {
      const element = _elementRef.nativeElement
      element.addEventListener('mousedown', this._cellMouseDown, true)
      element.addEventListener('mouseup', this._cellMouseUp, true)
      element.addEventListener('mouseover', this._cellMouseLeave, true)
    })
  }

  private _cellMouseDown = (event: Event) => {
    const cell = this._getCellFromElement(event.target as HTMLElement)
    this.previewStart = cell.compareValue
    if (cell) {
      this._ngZone.run(() => this.previewChange.emit({
        value: cell,
        event,
        selectionComplete: false}))
    }
  }

  private _cellMouseUp = (event: Event) => {
    const cell = this._getCellFromElement(event.target as HTMLElement)

    if (cell.compareValue != this.previewStart) {
      this._ngZone.run(() => this.previewChange.emit({value: cell, event, selectionComplete: true}))
    } else {
      this._ngZone.run(() => this.selectedValueChange.emit({value: cell.compareValue, event}))
    }
  }

  private _cellMouseLeave = (event: Event) => {
    if (this.previewStart && isTableCell(event.target as HTMLElement)) {
      const cell = this._getCellFromElement(event.target as HTMLElement)
      if (cell) {
        console.log(cell.value)
        this._ngZone.run(
          () => this.previewChange.emit({
          value: cell,
          event,
          selectionComplete: false}))
      }
    }
  }

  _cellClicked(cell: NavCalendarCell, event: MouseEvent): void {
    if (cell.enabled && !this.isRange) {
      this.selectedValueChange.emit({value: cell.compareValue, event})
    }
  }

  private _getCellFromElement(element: HTMLElement): NavCalendarCell | null {
    let cell: HTMLElement | undefined

    if (isTableCell(element)) {
      cell = element
    } else if (isTableCell(element.parentNode)) {
      cell = element.parentNode as HTMLElement
    }

    if (cell) {
      const row = cell.getAttribute('data-mat-row')
      const col = cell.getAttribute('data-mat-col')

      if (row && col) {
        return this.rows[parseInt(row)][parseInt(col)]
      }
    }

    return null
  }

  _isSelected(value: number): boolean {
    return this.startValue === value || this.endValue === value
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

  ngOnDestroy(): void {
    const element = this._elementRef.nativeElement
    element.removeEventListener('mousedown', this._cellMouseDown, true)
    element.removeEventListener('mouseup', this._cellMouseUp, true)
    element.removeEventListener('mouseleave', this._cellMouseLeave, true)
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

function isTableCell(node: Node) {
  return (node as HTMLElement).getAttribute('role') === 'cell'
}

