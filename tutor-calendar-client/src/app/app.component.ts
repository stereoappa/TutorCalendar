import { Component } from '@angular/core'
import {DateAdapter} from '../core/date-adapter'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent<D> {
  title = 'Tutor Calendar'

  constructor(private _dateAdapter: DateAdapter<D>) {
  }

  handleSelectionChanged(event: any) {
    console.log(event)
  }
}
