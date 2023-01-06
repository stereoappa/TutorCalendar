import {NgModule} from '@angular/core'
import {NavCalendar} from './nav-calendar'
import {CommonModule} from '@angular/common'
import {CalendarBodyComponent} from './nav-calendar-body'

@NgModule({
  declarations: [
    NavCalendar,
    CalendarBodyComponent],
  imports: [CommonModule],
  exports: [
    NavCalendar,
    CalendarBodyComponent
  ],
})
export class DateNavigatorModule { }
