import {Component, ViewChild} from '@angular/core'
import {NavCalendarComponent} from '../date-navigator/nav-calendar.component'
import {DateRange} from '../date-navigator/date-selection-model'
import {DateAdapter} from '../../core/date-adapter'
import {NavCalendarUserEvent} from '../date-navigator/calendar-body'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent<D> {
  @ViewChild(NavCalendarComponent) _calendar: NavCalendarComponent<D>

  constructor(private _dateAdapter: DateAdapter<D>) {

  }

  _getSelected(): DateRange<D> | D | null {
    // return this._model.selection as unknown as D | DateRange<D> | null;
    return new DateRange<D>(
      this._dateAdapter.addCalendarDays(this._dateAdapter.today(), -2),
      this._dateAdapter.addCalendarDays(this._dateAdapter.today(), 2))
  }

  _handleUserSelection(event: NavCalendarUserEvent<D | null>): void {
    const value = event.value
    const isRange = value instanceof DateRange

    console.log(event)
  }
}
