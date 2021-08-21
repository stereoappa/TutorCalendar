import {Component, HostBinding, Input, OnInit, Optional} from '@angular/core'
import * as moment from 'moment'
import {DateAdapter} from '../../core/date-adapter'

@Component({
  selector: 'app-nav-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  // host: {
  //   'class': 'mat-calendar',
  // }
})

export class CalendarComponent<D> implements OnInit {

  constructor(@Optional() private _dateAdapter: DateAdapter<D>) {
  }

  @Input()
  get startAt(): D | null { return this._startAt }
  set startAt(value: D | null) {
    this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value))
  }
  @Input() initializeMoment: moment.Moment
  private _startAt: D | null

  ngOnInit(): void {
  }

  onClick(event: any): void {
    const element = event.target.dataset.button
    if (element === 'prev') {
      this.initializeMoment.add(-1, 'M')
    }
    if (element === 'next') {
      this.initializeMoment.add(1, 'M')
    }
  }

  getWeekdaysShortArray(): string[] {
    return moment.weekdaysMin(true)
  }

  weeksStartOf(anyMoment: moment.Moment, countOfWeek): moment.Moment[][] {
    const firstMonthDay = moment(anyMoment).startOf('month')

    const weeks = []
    for (let i = 0; i < countOfWeek; i++) {
      weeks.push(this.getWeek(firstMonthDay))

      firstMonthDay.add(7, 'd')
    }

    return weeks
  }

  getWeek(momentOfWeek = moment()): moment.Moment[] {
    const monday = moment(momentOfWeek).startOf('week')
    const res = [monday]

    for (let i = 2; i <= 7; i++) {
      res.push(this.getWeekday(i, monday))
    }
    return res
  }

  getWeekday(num: number, dayOfWeek: moment.Moment = moment()): moment.Moment {
    return moment(dayOfWeek).isoWeekday(num)
  }

  daysGrid(userMoment): string {
    const weeks = this.weeksStartOf(userMoment, 6)

    let res = ''
    weeks.map(w => {
      res += `<div class="row">`
      res += w.map(d => {
        const active = moment().isSame(d, 'days') ? 'active' : ''
        const grayDay = d.isSame(userMoment, 'month') ? '' : 'gray-day'
        return `<span class="cell ${active}${grayDay}"><div class="day-number">${d.date()}</div></span>`
      }).join('')
      res += `</div>`
    }).join('')

    return res
  }
}
