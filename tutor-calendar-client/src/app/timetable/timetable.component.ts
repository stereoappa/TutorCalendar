import {Component, Input, OnInit} from '@angular/core'
import {DateAdapter} from '../../core/date-adapter'
import {NavDateSelectionModel} from '../date-navigator/date-selection-model'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent<D> implements OnInit {
  private _valueChangesSubscription = Subscription.EMPTY

  @Input() coverageDays: {day: string, title: string}[] | null

  constructor(private _dateAdapter: DateAdapter<D>,
              private _model: NavDateSelectionModel<D>) {
    this._registerModel(_model)
  }

  _registerModel(model: NavDateSelectionModel<D>): void {
    this._valueChangesSubscription.unsubscribe()

    this._valueChangesSubscription = model.selectionChanged.subscribe(event => {
      const value = event.selection
      console.log('Model CHANGED:', value)
    })
  }

  ngOnInit(): void {
  }


}
