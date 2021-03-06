import {NgModule} from '@angular/core'
import {NavCalendar} from './nav-calendar'
import {CommonModule} from '@angular/common'
import {CalendarBodyComponent} from './nav-calendar-body'
import {NAV_RANGE_DATE_SELECTION_MODEL_PROVIDER} from './date-selection-model'

@NgModule({
  declarations: [
    NavCalendar,
    CalendarBodyComponent],
  imports: [CommonModule],
  exports: [
    NavCalendar,
    CalendarBodyComponent
  ],
  providers: [NAV_RANGE_DATE_SELECTION_MODEL_PROVIDER]
})
export class DateNavigatorModule { }
