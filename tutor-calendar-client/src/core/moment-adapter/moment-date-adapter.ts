import {DateAdapter, MAT_DATE_LOCALE} from '../date-adapter'
import * as moment from 'moment'
import {Inject, Injectable, Optional} from '@angular/core'

@Injectable()
export class MomentDateAdapter extends DateAdapter<moment.Moment>{

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super()
    this.setLocale(dateLocale || moment.locale())
  }

  setLocale(locale: any): void {
    super.setLocale(locale)

    const momentLocaleData = moment.localeData(locale)
  }

  addCalendarMonths(date: moment.Moment, months: number): moment.Moment {
    return undefined
  }

  clone(date: moment.Moment): moment.Moment {
    return undefined
  }

  createDate(year: number, month: number, date: number): moment.Moment {
    return undefined
  }

  getYear(date: moment.Moment): number {
    return 0
  }

  parse(value: any, parseFormat: any): moment.Moment | null {
    return undefined
  }

  today(): moment.Moment {
    return undefined
  }

  invalid(): moment.Moment {
    return undefined;
  }

  isDateInstance(obj: any): boolean {
    return false;
  }

  isValid(date: moment.Moment): boolean {
    return false;
  }
}
