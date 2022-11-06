import { Pipe, PipeTransform } from '@angular/core'
import {Time} from '../components/timetable/model/time-model'

@Pipe({
  name: 'textFilter'
})
export class TextFilterPipe implements PipeTransform {

  transform(options: Time[], filterText: string = null): Time[] {
    if (options && filterText) {
      debugger
      return options.filter(x => x.toString().startsWith(filterText))
    }
  }

}
