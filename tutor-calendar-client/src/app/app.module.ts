import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { HeaderComponent } from './header/header.component'
import { TimetableComponent } from './timetable/timetable.component'
import { SharedModule } from './shared/shared.module'
import {DateAdapter, NAV_DATE_LOCALE} from '../core/date-adapter'
import {MomentDateAdapter} from '../core/moment-adapter/moment-date-adapter'
import {NAV_DATE_FORMATS} from '../core/date-formats'
import {NAV_MOMENT_DATE_FORMATS} from '../core/moment-adapter/moment-date-formats'
import { TimetableSlotComponent } from './timetable/timetable-slot.component'
import { TimetableColumnComponent } from './timetable/timetable-column.component'
import { TimetablePreviewComponent } from './timetable/timetable-preview.component'
import {TimetablePreviewService} from './timetable/timetable-preview.service'
import {OverlayModule} from '@angular/cdk/overlay'

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        HeaderComponent,
        TimetableComponent,
        TimetableSlotComponent,
        TimetableColumnComponent,
        TimetablePreviewComponent
    ],
  imports: [
    BrowserModule,
    SharedModule,
    OverlayModule
  ],
  providers: [
    {
      provide: NAV_DATE_LOCALE,
      useValue: 'ru-RU'
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [NAV_DATE_LOCALE]
    },
    {
      provide: NAV_DATE_FORMATS,
      useValue: NAV_MOMENT_DATE_FORMATS
    },
    TimetablePreviewService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }





