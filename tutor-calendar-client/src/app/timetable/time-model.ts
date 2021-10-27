export class Time {
  constructor(public hour: number,
              public minute: number,
              public second?: number | 0) {
  }

  toString() {
    return `${this.hour}:${this.minute.toString().padStart(2, '0')}`
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
  constructor(readonly start: Time | null,
              readonly end: Time | null) {
  }

  toString() {
    return `${this.start.toString()}–${this.end.toString()}`
  }
}

