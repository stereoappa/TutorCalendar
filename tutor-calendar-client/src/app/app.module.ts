import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { HeaderComponent } from './header/header.component'
import { TimetableComponent } from './timetable/timetable.component'
import { SharedModule } from './shared/shared.module'
import { NAV_DATE_LOCALE } from '../core/date-adapter'

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    TimetableComponent
  ],
  imports: [
    BrowserModule,
    SharedModule
  ],
  providers: [{provide: NAV_DATE_LOCALE, useValue: 'ru-RU' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
