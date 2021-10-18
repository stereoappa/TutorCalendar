import {Component, Input} from '@angular/core'
import {Slot} from './timetable.component'

@Component({
  selector: 'app-timetable-column',
  templateUrl: './timetable-column.component.html',
  styleUrls: ['./timetable-column.component.scss']
})
export class TimetableColumnComponent<D>  {

  @Input() dateKey: string

  @Input() slots: Slot[] | []

  constructor() { }

  // private _cellMouseDown(event) {
  //   const dateKey = event.target.getAttribute('data-datekey')
  //   if (dateKey) {
  //     if (this._dateAdapter.getDateByKey(dateKey)) {
  //       this._previewSelectionModel.previewStart(dateKey, this._getTime(event.clientY))
  //
  //       this._ngZone.runOutsideAngular(() => {
  //         const element = this._elementRef.nativeElement
  //         element.addEventListener('mousemove', this._cellMouseOver.bind(this), true)
  //       })
  //     }
  //   }
  // }
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
