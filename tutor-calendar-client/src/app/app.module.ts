import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

import {AppComponent} from './app.component'
import {SidebarComponent} from './components/sidebar/sidebar.component'
import {HeaderComponent} from './components/header/header.component'
import {Timetable} from './components/timetable/timetable'
import {SharedModule} from './shared/shared.module'
import {DateAdapter, NAV_DATE_LOCALE} from '../core/date-adapter'
import {MomentDateAdapter} from '../core/moment-adapter/moment-date-adapter'
import {NAV_DATE_FORMATS} from '../core/date-formats'
import {NAV_MOMENT_DATE_FORMATS} from '../core/moment-adapter/moment-date-formats'
import {TimetableSlot} from './components/timetable/timetable-slot'
import {TimetableColumn} from './components/timetable/timetable-column'
import {TimetablePreview} from './components/timetable/timetable-preview'
import {TimetablePreviewService} from './services/timetable-preview.service'
import {OverlayModule} from '@angular/cdk/overlay'
import {ActivityAddDialog} from './components/activity-add-dialog/activity-add-dialog'
import {MatDialogModule} from '@angular/material/dialog'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {DragDropModule} from '@angular/cdk/drag-drop'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {TimelineService} from './services/timeline.service'
import { ModalComponent } from './components/modal/modal.component'
import { TimeRangeSelectorComponent } from './components/time-range-selector/time-range-selector.component'
import {DateSelectionService} from './services/date-selection-service'
import {DateNavigatorModule} from './components/date-navigator/date-navigator.module'

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    Timetable,
    TimetableSlot,
    TimetableColumn,
    TimetablePreview,
    ActivityAddDialog,
    ModalComponent,
    TimeRangeSelectorComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    OverlayModule,
    MatDialogModule,
    DragDropModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DateNavigatorModule,
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
    DateSelectionService,
    TimelineService,
    TimetablePreviewService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}





