import {Component, Input, Output, EventEmitter} from '@angular/core'

export class NavCalendarCell<D = any> {
  constructor(public value: number,
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

  @Output() readonly selectedValueChange = new EventEmitter<NavCalendarUserEvent<number> | null>()

  _cellClicked(cell: NavCalendarCell, event: MouseEvent): void {
    if (cell.enabled) {
      this.selectedValueChange.emit({value: cell.value, event})
      console.log({value: cell.value, event})
    }
  }
}
