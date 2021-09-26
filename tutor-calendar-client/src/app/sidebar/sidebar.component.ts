import {Component, Input, OnChanges, SimpleChanges} from '@angular/core'
import {DateRange} from '../date-navigator/date-selection-model'
import {DateAdapter} from '../../core/date-adapter'
import {NavCalendarUserEvent} from '../date-navigator/nav-calendar-body'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent<D> implements OnChanges {
  @Input()
  get selected(): DateRange<D> | D | null {
    return this._selected
  }
  set selected(value: DateRange<D> | D | null) {
    this._selected = value
  }
  private _selected: DateRange<D> | D | null

  constructor(private _dateAdapter: DateAdapter<D>) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[SIDEBAR] ', changes)
  }

  _getStartAt(): D | null {
    return this._dateAdapter.today()
  }

  _handleUserSelection(event: NavCalendarUserEvent<D | DateRange<D> | null>): void {
    const value = event.value
    console.log('sidebar emmited value:', value)
    const isRange = value instanceof DateRange
    this.selected = value
  }
}
