import {Injectable} from '@angular/core'

export class Time {
  constructor(public hour: number,
              public minute: number) { }

  toString() {
    return `${this.hour}:${this.minute.toString().padStart(2, '0')}`
  }

  addMinutes(minutes: number): Time {
    return new Time(
      this.hour + Math.trunc((this.minute + minutes) / 60),
      (this.minute + minutes) % 60)
  }
}

@Injectable({providedIn: 'root'})
export class SlotSelectionModel<D> {

}
