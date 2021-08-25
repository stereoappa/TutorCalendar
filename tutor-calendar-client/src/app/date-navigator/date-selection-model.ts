export class DateRange<D> {
  constructor(
    readonly start: D | null,
    readonly end: D | null) {}
}

export function selectionFinished<D>(date: D, currentRange: DateRange<D>): DateRange<D> {
  let {start, end} = currentRange

  if (start == null) {
    start = date
  } else if (end == null && date && this._dateAdapter.compareDate(date, start) >= 0) {
    end = date
  } else {
    start = date
    end = null
  }

  return new DateRange<D>(start, end)
}

export function createPreview<D>(activeDate: D | null, currentRange: DateRange<D>): DateRange<D> {
  let start: D | null = null
  let end: D | null = null

  if (currentRange.start && !currentRange.end && activeDate) {
    start = currentRange.start
    end = activeDate
  }

  return new DateRange<D>(start, end)
}
