import {Component} from '@angular/core'
import {DateAdapter} from '../core/date-adapter'
import {DateRange, NavDateSelectionModel} from './components/date-navigator/date-selection-model'
import {Subscription} from 'rxjs'
import {ColumnDay, Slot} from './components/timetable/timetable-column'
import {TimetableUserEvent} from './components/timetable/timetable'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent<D> {
  private _dateNavigatorSelectionChangedSubscription = Subscription.EMPTY

  _columns: ColumnDay<D>[] | null

  constructor(private model: NavDateSelectionModel<D>,
              private _dateAdapter: DateAdapter<D>) {
    this._columns = this._columns ?? [this._toColumnDay(this._dateAdapter.today())]
    this._registerModel(model)
  }

  _registerModel(model: NavDateSelectionModel<D>): void {
    this._dateNavigatorSelectionChangedSubscription.unsubscribe()
    this._dateNavigatorSelectionChangedSubscription = model.selectionChanged.subscribe(event => {
      this._initColumns(event.selection)
    })
  }

  _initColumns(selection: D | DateRange<D> | null) {
    if (selection instanceof DateRange) {
      const range = selection as DateRange<D>
      this._columns = this._dateAdapter
        .toArray(range.start, range.end)
        .map(day => this._toColumnDay(day))
    } else {
      const day = selection as D
      this._columns = [this._toColumnDay(day)]
    }
  }

  _handleSlotCreated(event: TimetableUserEvent<Slot>) {
    const column = this._columns.find(c => c.datekey === event.args.position.datekey)
    if (column) {
      column.slots.push(event.args)
    }
  }

  _toColumnDay(day: D): ColumnDay<D> {
    const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow')
    const longWeekdays = this._dateAdapter.getDayOfWeekNames('long')
    const weekdays = longWeekdays.map((long, i) => {
      return {long, narrow: narrowWeekdays[i]}
    })

    return new ColumnDay<D>(
      this._dateAdapter.getDate(day),
      this._dateAdapter.format(day, 'DD'),
      weekdays[this._dateAdapter.getDayOfWeek(day)],
      this._dateAdapter.getDateKey(day),
      day,
      [])
  }

  private _getColumn(dateKey: number) {
    if (!dateKey) {
      return null
    }
    const day = this._dateAdapter.getDateByKey(dateKey)
    return this._columns.find(d => this._dateAdapter.sameDate(d.rawValue, day)) ?? null
  }
}
