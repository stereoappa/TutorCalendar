import { Pipe, PipeTransform } from '@angular/core'
import {Time} from '../components/timetable/model/time-model'

@Pipe({
  name: 'startWithTimeFilter'
})
export class StartWithTimeFilterPipe implements PipeTransform {

  transform(options: Time[], minTime: Time): Time[] {
    if (options && minTime) {
      return options.filter(x => x.toCompareValue() > minTime.toCompareValue())
    }
  }
}
