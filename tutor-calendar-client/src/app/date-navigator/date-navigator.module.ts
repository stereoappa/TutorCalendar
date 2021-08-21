import {NgModule} from '@angular/core'
import {CalendarComponent} from './calendar.component'
import {CommonModule} from '@angular/common'
import {DateAdapter, MAT_DATE_LOCALE} from '../../core/date-adapter'
import {MomentDateAdapter} from '../../core/moment-adapter/moment-date-adapter'

@NgModule({
  declarations: [CalendarComponent],
  imports: [CommonModule],
  exports: [CalendarComponent],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    }
  ]
})
export class DateNavigatorModule { }
