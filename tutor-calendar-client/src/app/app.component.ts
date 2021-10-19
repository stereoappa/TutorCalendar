import { Component } from '@angular/core'
import {DateAdapter} from '../core/date-adapter'
import {DateRange, NavDateSelectionModel} from './date-navigator/date-selection-model'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent<D> {
  private _valueChangesSubscription = Subscription.EMPTY

  selected: D | DateRange<D>

  constructor(private model: NavDateSelectionModel<D>,
              private _dateAdapter: DateAdapter<D>) {
    this._registerModel(model)
  }

  _registerModel(model: NavDateSelectionModel<D>): void {
    this._valueChangesSubscription.unsubscribe()
    this._valueChangesSubscription = model.selectionChanged.subscribe(event => this.selected = event.selection)
  }
}
