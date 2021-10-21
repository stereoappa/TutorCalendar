import {Component, ElementRef, EventEmitter, Input, NgZone, Output} from '@angular/core'
import {Slot} from './timetable.component'

export class TimetableSlotPreview {
  constructor(public clientY: number,
              public selectionComplete: boolean) {
  }
}

export interface TimetableUserEvent<T> {
  value: T
  datekey: number
  event: Event
}

@Component({
  selector: 'app-timetable-column',
  templateUrl: './timetable-column.component.html',
  styleUrls: ['./timetable-column.component.scss']
})
export class TimetableColumnComponent {

  @Input() dateKey: number

  @Input() slots: Slot[] | []

  @Output() readonly previewChange =
    new EventEmitter<TimetableUserEvent<TimetableSlotPreview> | null>()

  constructor(private _elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
    _ngZone.runOutsideAngular(() => {
        const element = _elementRef.nativeElement
        element.addEventListener('mousedown', this._cellMouseDown, true)
      }
    )
  }

  private _cellMouseDown = (event: MouseEvent) => {
    this._ngZone.run(() => this.previewChange.emit({
      value: new TimetableSlotPreview(event.clientY, false),
      datekey: this.dateKey,
      event
    }))
  }

  // private _cellMouseOver(event) {
  //   console.log(event.clientY)
  //   this._previewSelectionModel.previewUpdate(this._getTime(event.clientY))
  // }
  //
  // private _cellMouseUp(event) {
  //   debugger
  //   this._elementRef.nativeElement.removeEventListener('mousemove', this._cellMouseOver.bind(this), true)
  //   if (!this._previewSelectionModel.selectionComplete) {
  //     const preview = this._previewSelectionModel.getSelection()
  //     const coverageDay = this._getCoverageDay(preview.dateKey)
  //     if (coverageDay) {
  //
  //
  //       coverageDay.slots = [
  //         ...coverageDay.slots,
  //         new Slot('(new)', preview.timeRange.toString(), this._calculatePositionStyle(preview.timeRange))]
  //     }
  //   }
  // }
}
