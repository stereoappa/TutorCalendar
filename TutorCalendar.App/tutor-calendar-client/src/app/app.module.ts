import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { TimetableComponent } from './timetable/timetable.component';
import { MonthNavigatorComponent } from './month-navigator/month-navigator.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    TimetableComponent,
    MonthNavigatorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
