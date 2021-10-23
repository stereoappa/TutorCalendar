import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {DateNavigatorModule} from '../date-navigator/date-navigator.module'

@NgModule({
  declarations: [],
  imports: [CommonModule, DateNavigatorModule],
  exports: [CommonModule, DateNavigatorModule]
})
export class SharedModule { }
