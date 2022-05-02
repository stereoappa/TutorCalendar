import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {DateNavigatorModule} from '../date-navigator/date-navigator.module';
import { DropdownInputComponent } from './dropdown-input/dropdown-input.component'

@NgModule({
  declarations: [
    DropdownInputComponent
  ],
  imports: [CommonModule, DateNavigatorModule],
  exports: [CommonModule, DateNavigatorModule, DropdownInputComponent]
})
export class SharedModule { }
