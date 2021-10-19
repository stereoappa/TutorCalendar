import {Injectable} from '@angular/core'

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

@Injectable({providedIn: 'root'})
export class PreviewSelectionModel {

  private _startTime: Time | null

  private _endTime: Time | null

  private _dateKey: number | null

  private _selectionComplete: boolean | null

  get selectionComplete(): boolean {
    return this._selectionComplete ?? true
  }

  previewStart(dateKey: number, startTime: Time) {
    if (!this.selectionComplete) {
      return
    }

    this._selectionComplete = false
    this._dateKey = dateKey
    this._startTime = startTime
  }

  previewUpdate(endTime: Time) {
    if (this.selectionComplete) {
      return
    }

    this._endTime = endTime
  }

  getSelection(): {dateKey: number, timeRange: TimeRange} {
    if (this._startTime && this._endTime && !this.selectionComplete) {
      this._selectionComplete = true
      const selection = {dateKey: this._dateKey, timeRange: new TimeRange(this._startTime, this._endTime)}
      this._startTime = this._endTime = this._dateKey = null
      this._selectionComplete = true

      return selection
    }
  }
}
