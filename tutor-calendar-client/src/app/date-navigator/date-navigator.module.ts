import {NgModule} from '@angular/core'
import {NavCalendarComponent} from './nav-calendar.component'
import {CommonModule} from '@angular/common'
import {DateAdapter, NAV_DATE_LOCALE} from '../../core/date-adapter'
import {MomentDateAdapter} from '../../core/moment-adapter/moment-date-adapter'
import {CalendarBodyComponent} from './calendar-body'
import {NAV_DATE_FORMATS} from '../../core/date-formats'
import {NAV_MOMENT_DATE_FORMATS} from '../../core/moment-adapter/moment-date-formats'

@NgModule({
  declarations: [
    NavCalendarComponent,
    CalendarBodyComponent],
  imports: [CommonModule],
  exports: [
    NavCalendarComponent,
    CalendarBodyComponent
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [NAV_DATE_LOCALE]
    },
    {
      provide: NAV_DATE_FORMATS,
      useValue: NAV_MOMENT_DATE_FORMATS
    }
  ]
})
export class DateNavigatorModule { }
