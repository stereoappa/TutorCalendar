import {Component, ElementRef, EventEmitter, Inject, Input, NgZone, Output} from '@angular/core'
import {TimetableUserEvent} from './timetable.component'
import {TimeRange} from './time-model'
import {DOCUMENT} from '@angular/common'

export class ColumnDay<D = any> {
  constructor(public value: number,
              public title: string,
              public weekday: { long: string, narrow: string },
              public datekey: number,
              public rawValue: D,
              public slots: Slot[] = []) {
  }
}

export interface ISlotPosition {
  datekey: number
  top: number,
  height: number
}

export class Slot {
  constructor(readonly title: string | null,
              public timeRange: TimeRange | null,
              public position: ISlotPosition) {
  }
}

export class TimetableColumnActionEventArgs {
  constructor(public datekey: number,
              public clientY: number,
              public action: 'click' | 'selection' | 'selectionEnd') {
  }
}

const FIRING_EVENT_THRESHOLD = 5

@Component({
  selector: 'app-timetable-column',
  templateUrl: './timetable-column.component.html',
  styleUrls: ['./timetable-column.component.scss']
})
export class TimetableColumnComponent {

  @Input() datekey: number

  @Input() slots: Slot[] | []

  @Output() readonly selectionChanged =
    new EventEmitter<TimetableUserEvent<TimetableColumnActionEventArgs> | null>()

  private _lastMouseDownY: number | null

  constructor(private _elementRef: ElementRef<HTMLElement>,
              private _ngZone: NgZone,
              @Inject(DOCUMENT) private document: Document) {
    _ngZone.runOutsideAngular(() => {
        const element = _elementRef.nativeElement
        element.addEventListener('click', this._emitSelectionChangedEvent, true)
        element.addEventListener('mousedown', this._columnMouseDown, true)
      }
    )
  }

  private _columnMouseDown = (event: MouseEvent) => {
    this._lastMouseDownY = event.clientY

    this._ngZone.runOutsideAngular(() => {
      this.document.addEventListener('mousemove', this._mouseMoveHandler, true)
      this.document.addEventListener('mouseup', this._mouseUpHandler, true)
    })
  }

  private _mouseMoveHandler = (e: MouseEvent) => this._threshold(this._emitSelectionChangedEvent, FIRING_EVENT_THRESHOLD, e)

  private _mouseUpHandler = (e: MouseEvent) => {
    this.document.removeEventListener('mousemove', this._mouseMoveHandler, true)
    this.document.removeEventListener('mouseup', this._mouseUpHandler, true)
    this._emitSelectionChangedEvent(e)
  }

  private _emitSelectionChangedEvent = (event: MouseEvent) => {
    this._ngZone.run(() => this.selectionChanged.emit({
      args: new TimetableColumnActionEventArgs(
        this.datekey,
        event.clientY,
        event.type === 'click' ? 'click' :
           event.type === 'mousemove' ? 'selection' :
           'selectionEnd'),
      event
    }))
  }

  private _threshold = (fn: Function, threshold: number, event: MouseEvent) => {
    if (Math.abs(this._lastMouseDownY - event.clientY) > threshold) {
      this._lastMouseDownY = event.clientY
      fn(event)
    }
  }
}
