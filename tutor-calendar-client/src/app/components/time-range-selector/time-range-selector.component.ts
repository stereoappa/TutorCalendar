import {Component, EventEmitter, forwardRef, Inject, Injector, OnInit, Output} from '@angular/core'
import {TimelineService} from '../../services/timeline.service'
import {TimetableUserEvent} from '../timetable/timetable'
import {Time, TimeRange} from '../timetable/model/time-model'
import {Converter} from '../../shared/converters'
import {
  ControlValueAccessor,
  FormControl, FormControlDirective, FormControlName,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms'

@Component({
  selector: 'app-time-range-selector',
  templateUrl: './time-range-selector.component.html',
  styleUrls: ['./time-range-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeRangeSelectorComponent),
      multi: true,
    },
  ],
})
export class TimeRangeSelectorComponent implements OnInit, ControlValueAccessor {
  _timeOptions: Time[]

  _startDropdownOpenedVal: boolean | null

  _endDropdownOpenedVal: boolean | null

  control!: FormControl<TimeRange>

  inputValue: string

  // @Output() readonly timeRangeChanged = new EventEmitter<TimetableUserEvent<TimeRange>>()

  timeConverter: Converter<Time> = value => Time.parse(value)

  constructor(
    @Inject(Injector) private injector: Injector,
    private readonly _timelineService: TimelineService) {
    this._timeOptions = _timelineService.createTimeline(_timelineService.previewPrecision)
  }

  ngOnInit(): void {
    this.setComponentControl()
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this.onChange(obj)
  }

  private onChange = (value: any) => {
  }

  private setComponentControl(): void {
    const injectedControl = this.injector.get(NgControl)

    switch (injectedControl.constructor) {
      case FormControlName: {
        this.control = this.injector.get(FormGroupDirective).getControl(injectedControl as FormControlName)
        break
      }
      default: {
        this.control = (injectedControl as FormControlDirective).form as FormControl
        break
      }
    }
  }

  get startDropdownOpened(): boolean | null{
    return this._startDropdownOpenedVal
  }

  set startDropdownOpened(val: boolean | null) {
    this._endDropdownOpenedVal = null
    this._startDropdownOpenedVal = val
  }

  get endDropdownOpened(): boolean | null {
    return this._endDropdownOpenedVal
  }

  set endDropdownOpened(val: boolean | null) {
    this._startDropdownOpenedVal = null
    this._endDropdownOpenedVal = val
  }

  get startValue(): Time {
    return this.control?.value?.start
  }

  get endValue(): Time {
    return this.control?.value?.end
  }

  onStartTimeChanged(event: TimetableUserEvent<Time>) {
    this.control.setValue(new TimeRange(event.args, this.endValue))
  }

  onEndTimeChanged(event: TimetableUserEvent<Time>) {
    this.control.setValue(new TimeRange(this.startValue, event.args))
  }

  onInputValue(event: TimetableUserEvent<string>) {
    this.inputValue = event.args
  }
}
