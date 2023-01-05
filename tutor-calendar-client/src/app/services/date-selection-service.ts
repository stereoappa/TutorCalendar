import {FactoryProvider, Injectable, Optional, SkipSelf } from '@angular/core'
import {DateAdapter} from '../../core/date-adapter'
import {Observable, Subject} from 'rxjs'

export class DateRange<D> {
  constructor(
    readonly start: D | null,
    readonly end: D | null) {}
}

export interface DateSelectionModelChange<S, D> {
  selectedDays: Array<D>

  source: unknown

  oldValue?: S
}

@Injectable({providedIn: 'root'})
export class DateSelectionService<D> {
  selection: D

  private readonly _selectionChanged = new Subject<DateSelectionModelChange<D | DateRange<D>, D>>()

  selectionChanged: Observable<DateSelectionModelChange<D | DateRange<D>, D>> = this._selectionChanged

   constructor(private dateAdapter: DateAdapter<D>) {
   }

  updateSelection(value: D | DateRange<D>, source: unknown) {
    const oldValue = (this as {selection: D | DateRange<D>}).selection;
    (this as {selection: D | DateRange<D>}).selection = value

    this._selectionChanged.next({
      selectedDays: this.toDays(value),
      source,
      oldValue
    })
  }

  ngOnDestroy() {
    this._selectionChanged.complete()
  }

  private toDays(selection: D | DateRange<D> | null): D[] {
    if (selection instanceof DateRange) {
      const range = selection as DateRange<D>
      return this.dateAdapter.toArray(range.start, range.end)
    } else {
      const day = selection as D
      return [day]
    }
  }
}

export function NAV_RANGE_DATE_SELECTION_SERVICE_FACTORY(
  parent: DateSelectionService<unknown>, adapter: DateAdapter<unknown>) {
  return new DateSelectionService(adapter)
}

/**
 * Used to provide a range selection model to a components.
 **/
export const NAV_RANGE_DATE_SELECTION_SERVICE_PROVIDER: FactoryProvider = {
  provide: DateSelectionService,
  deps: [[new Optional(), new SkipSelf(), DateSelectionService], DateAdapter],
  useFactory: NAV_RANGE_DATE_SELECTION_SERVICE_FACTORY,
}
