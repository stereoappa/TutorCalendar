import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

import * as moment from 'moment'
import 'moment/locale/ru'

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))

moment.updateLocale('ru', {
  months : ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  weekdaysMin : ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
})

moment.locale('ru')
moment.weekdays(true)
