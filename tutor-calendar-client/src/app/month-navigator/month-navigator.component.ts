import {Component, Input, OnInit} from '@angular/core'
import * as moment from 'moment'
import {Moment} from 'moment';

@Component({
  selector: 'app-month-navigator',
  templateUrl: './month-navigator.component.html',
  styleUrls: ['./month-navigator.component.scss'],
})
export class MonthNavigatorComponent implements OnInit {
  @Input() initializeMoment: moment.Moment

  constructor() { }

  ngOnInit(): void {
  }

  getNowMoment(): Moment{
    return moment()
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
