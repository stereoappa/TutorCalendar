import * as moment from 'moment'
import {DATETIME_FORMAT} from './constants'

export function parse(date: any, format: string = DATETIME_FORMAT): moment.Moment {
  let res
  if (typeof date === 'string'){
    res = moment(date, format)
  }
  else if (moment.isMoment(date)){
    res = moment(date)
  }
  else if (moment.isDate(date)) {
    return moment(date)
  }

  return res.isValid() ? res : false
}

export function toTime(str: string): any {
  const parts = str.split(':')
  return {
    hour: +parts[0],
    minute: +parts[1]
  }
}








