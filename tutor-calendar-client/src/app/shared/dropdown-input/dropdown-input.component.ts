import {Component, forwardRef, Input, Provider} from '@angular/core'
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms'

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

  value: string

  constructor() {
  }

  setValue() {
    this.close()
    const val = this.converter ? this.converter(this.value) : this.value
    this.onChange(val)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(value: any): void {
    this.value = value
  }

  private onChange = (value: any) => {}

  open(event) {
    console.log('opened', event.target)
  }

  close() {
    console.log('closed')
  }
}
