import {NgModule} from '@angular/core'
import {NavCalendar} from './nav-calendar'
import {CommonModule} from '@angular/common'
import {DateAdapter, NAV_DATE_LOCALE} from '../../core/date-adapter'
import {MomentDateAdapter} from '../../core/moment-adapter/moment-date-adapter'
import {CalendarBodyComponent} from './nav-calendar-body'
import {NAV_DATE_FORMATS} from '../../core/date-formats'
import {NAV_MOMENT_DATE_FORMATS} from '../../core/moment-adapter/moment-date-formats'

@NgModule({
  declarations: [
    NavCalendar,
    CalendarBodyComponent],
  imports: [CommonModule],
  exports: [
    NavCalendar,
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
