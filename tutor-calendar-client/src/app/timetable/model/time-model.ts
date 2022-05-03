export class Time {
  constructor(public hour: number,
              public minute: number,
              public second?: number | 0) {
  }

  static createByString(str: string) {
    const arr = str.split(':')

    if (arr.length != 2) {
      return undefined
    }

    return new Time(parseInt(arr[0].trim()), parseInt(arr[1].trim()))
  }

  toString() {
    return `${this.hour}:${this.minute.toString().padStart(2, '0')}`
  }

  toCompareValue(): number {
    return (this.hour ?? 0) * 60 + (this.minute ?? 0)
  }

  addMinutes(minutes: number): Time {
    return new Time(
      this.hour + Math.trunc((this.minute + minutes) / 60),
      (this.minute + minutes) % 60, 0)
  }

  clone() {
    return new Time(this.hour, this.minute, this.second)
  }
}

export class TimeRange {
  start: Time | null

  end: Time | null

  constructor(private time1: Time | null,
              private time2: Time | null) {
    if (time1?.toCompareValue() > time2?.toCompareValue()) {
      this.start = time2
      this.end = time1
    } else {
      this.start = time1
      this.end = time2
    }
  }

  static empty: TimeRange = new TimeRange(null, null)

  toString() {
    return `${this.start.toString()}–${this.end.toString()}`
  }
}

