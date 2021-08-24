import {Component, Input} from '@angular/core'

export class MatCalendarCell<D = any> {
  constructor(public value: number,
              public displayValue: string,
              public enabled: boolean,
              public cssClasses,
              public rawValue?: D) {}
}

@Component({
  selector: 'app-nav-calendar-body',
  templateUrl: 'calendar-body.html',
  styleUrls: ['calendar-body.scss']
})
export class CalendarBodyComponent  {
  @Input() label: string

  @Input() rows: MatCalendarCell[][]

  @Input() weekdays: {long: string, narrow: string}[]

  @Input() activeCell = 0

  @Input() isRange = false

  @Input() startValue: number

  @Input() endValue: number
}
