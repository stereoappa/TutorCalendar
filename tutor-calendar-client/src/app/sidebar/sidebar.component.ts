import {Component, ViewChild} from '@angular/core'
import {NavCalendarComponent} from '../date-navigator/nav-calendar.component'
import {DateRange} from '../date-navigator/date-selection-model'
import {DateAdapter} from '../../core/date-adapter'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent<D> {
  @ViewChild(NavCalendarComponent) _calendar: NavCalendarComponent<D>

  startAt: any

  constructor(private _dateAdapter: DateAdapter<D>) {

  }

  _getSelected(): void {
  }

  _handleUserSelection(event: any): void {
    const value = event.value
    const isRange = value instanceof DateRange
  }
}
