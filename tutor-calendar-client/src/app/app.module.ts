import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { HeaderComponent } from './header/header.component'
import { Timetable } from './timetable/timetable'
import { SharedModule } from './shared/shared.module'
import {DateAdapter, NAV_DATE_LOCALE} from '../core/date-adapter'
import {MomentDateAdapter} from '../core/moment-adapter/moment-date-adapter'
import {NAV_DATE_FORMATS} from '../core/date-formats'
import {NAV_MOMENT_DATE_FORMATS} from '../core/moment-adapter/moment-date-formats'
import { TimetableSlot } from './timetable/timetable-slot'
import { TimetableColumn } from './timetable/timetable-column'
import { TimetablePreview } from './timetable/timetable-preview'
import {TimetablePreviewService} from './timetable/model/timetable-preview.service'
import {OverlayModule} from '@angular/cdk/overlay'

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        HeaderComponent,
        Timetable,
        TimetableSlot,
        TimetableColumn,
        TimetablePreview
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





