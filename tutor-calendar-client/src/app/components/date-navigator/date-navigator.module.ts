import {NgModule} from '@angular/core'
import {NavCalendar} from './nav-calendar'
import {CommonModule} from '@angular/common'
import {CalendarBodyComponent} from './nav-calendar-body'
import {SharedModule} from '../../shared/shared.module'

@NgModule({
  declarations: [
    NavCalendar,
    CalendarBodyComponent,
  ],
    imports: [CommonModule, SharedModule],
  exports: [
    NavCalendar,
    CalendarBodyComponent,
  ],
})
export class DateNavigatorModule { }
