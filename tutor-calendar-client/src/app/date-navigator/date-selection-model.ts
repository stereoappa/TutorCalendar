import {FactoryProvider, Injectable, Optional, SkipSelf } from '@angular/core'
import {DateAdapter} from '../../core/date-adapter'
import {Observable, Subject} from 'rxjs'

export class DateRange<D> {
  constructor(
    readonly start: D | null,
    readonly end: D | null) {}
}

export interface DateSelectionModelChange<S> {
  /** New value for the selection. */
  selection: S

  /** Object that triggered the change. */
  source: unknown

  /** Previous value */
  oldValue?: S
}

@Injectable({providedIn: 'root'})
export class NavDateSelectionModel<D> {
  private readonly _selectionChanged = new Subject<DateSelectionModelChange<D | DateRange<D>>>()

  selectionChanged: Observable<DateSelectionModelChange<D | DateRange<D>>> = this._selectionChanged

   constructor(
     readonly selection: D,
     private _adapter: DateAdapter<D>) {
     this.selection = selection
   }

  updateSelection(value: D | DateRange<D>, source: unknown) {
    const oldValue = (this as {selection: D | DateRange<D>}).selection;
    (this as {selection: D | DateRange<D>}).selection = value
    this._selectionChanged.next({selection: value, source, oldValue})
  }

  ngOnDestroy() {
    this._selectionChanged.complete()
  }
}

export function NAV_RANGE_DATE_SELECTION_MODEL_FACTORY(
  parent: NavDateSelectionModel<unknown>, adapter: DateAdapter<unknown>) {
  return new NavDateSelectionModel(null, adapter)
}

/**
 * Used to provide a range selection model to a components.
 **/
export const NAV_RANGE_DATE_SELECTION_MODEL_PROVIDER: FactoryProvider = {
  provide: NavDateSelectionModel,
  deps: [[new Optional(), new SkipSelf(), NavDateSelectionModel], DateAdapter],
  useFactory: NAV_RANGE_DATE_SELECTION_MODEL_FACTORY,
}
