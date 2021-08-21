import {inject, InjectionToken, LOCALE_ID} from '@angular/core'

export const MAT_DATE_LOCALE = new InjectionToken<{}>('MAT_DATE_LOCALE', {
  providedIn: 'root',
  factory: MAT_DATE_LOCALE_FACTORY,
})

export function MAT_DATE_LOCALE_FACTORY(): {} {
  return inject(LOCALE_ID)
}

export abstract class DateAdapter<D, L = any> {
  protected locale: L

  abstract getYear(date: D): number

  abstract createDate(year: number, month: number, date: number): D

  abstract isDateInstance(obj: any): boolean

  abstract isValid(date: D): boolean

  abstract invalid(): D

  abstract clone(date: D): D

  abstract today(): D

  abstract addCalendarMonths(date: D, months: number): D

  abstract parse(value: any, parseFormat: any): D | null

  protected setLocale(locale: L): void {
    this.locale = locale
  }

  deserialize(value: any): D | null {
    if (value == null || this.isDateInstance(value) && this.isValid(value)) {
      return value
    }
    return this.invalid()
  }

  getValidDateOrNull(obj: unknown): D | null {
    return this.isDateInstance(obj) && this.isValid(obj as D) ? obj as D : null
  }
}
