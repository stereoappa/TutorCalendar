import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core'
import {DateRange, NavDateSelectionModel} from '../date-navigator/date-selection-model'
import {DateAdapter} from '../../../core/date-adapter'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent<D> implements OnInit, OnChanges {
  constructor(
    private _model: NavDateSelectionModel<D>,
    private _dateAdapter: DateAdapter<D>) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  _getSelected() {
    return this._model.selection as unknown as D | DateRange<D> | null
  }

  _getStartAt(): D | null {
    return this._dateAdapter.today()
  }

  ngOnInit(): void {
  }
}
