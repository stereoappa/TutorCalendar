import {Component, EventEmitter, forwardRef, Input, Output, Provider} from '@angular/core'
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms'
import {NavCalendarCell, NavCalendarUserEvent} from "../../components/date-navigator/nav-calendar-body";
import {Time} from "../../components/timetable/model/time-model";
import {TimetableUserEvent} from "../../components/timetable/timetable";

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownInputComponent),
  multi: true
}

type Converter<T> = (value: string) => T

@Component({
  selector: 'app-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss'],
  providers: [VALUE_ACCESSOR]
})
export class DropdownInputComponent<T> implements ControlValueAccessor {
  @Input() options: string[]

  @Input() converter: Converter<T> | null

  @Output() readonly valueChanged = new EventEmitter<TimetableUserEvent<T>>()

  value: string

  isOpened: boolean

  constructor() {
  }

  setValue(event) {
    this.close()

    const selectedValue = (event.target as HTMLElement).getAttribute('data-time-value')

    if (!selectedValue) {
      return
    }

    if (!this.converter) {
    }

    const time = this.converter(selectedValue)

    this.writeValue(time.toString())
    this.onChange(time.toString())

    this.valueChanged.emit({
      args: time,
    })
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(value: any): void {
    this.value = value
  }

  private onChange = (value: any) => {
    this.value = value
  }

  open(event) {
    this.isOpened = true
    console.log('opened', event.target)
  }

  close() {
    this.isOpened = false
    console.log('closed')
  }
}
