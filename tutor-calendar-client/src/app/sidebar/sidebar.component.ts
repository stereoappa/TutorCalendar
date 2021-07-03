import {Component} from '@angular/core'
import * as moment from 'moment'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  initializeMoment: moment.Moment = moment()
}
