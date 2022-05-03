import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {DateNavigatorModule} from '../date-navigator/date-navigator.module';
import { DropdownInputComponent } from './dropdown-input/dropdown-input.component'
import {FormsModule} from '@angular/forms'

@NgModule({
  declarations: [
    DropdownInputComponent
  ],
  imports: [CommonModule, DateNavigatorModule, FormsModule],
  exports: [CommonModule, DateNavigatorModule, DropdownInputComponent]
})
export class SharedModule { }
