import {Inject, Injectable} from '@angular/core'
import {END_TIMELINE, START_TIMELINE, TIMELINE_STEP} from '../shared/constants'
import {Time} from '../components/timetable/model/time-model'

@Injectable({providedIn: 'root'})
export class TimelineService {
  constructor(@Inject(TIMELINE_STEP) readonly timestep: number,
              @Inject(START_TIMELINE) private readonly startTimeline: Time,
              @Inject(END_TIMELINE) private readonly endTimeline: Time) { }

  private _timelineBase: Time[] = []
  get timelineBase(): Time[] {
    return this._timelineBase.length ? {...this._timelineBase} : this.createTimeline(this.timestep)
  }

  get slotPrecision(): number {
    return this.timestep / 2
  }

  get previewPrecision(): number {
    return this.timestep / 4
  }

  get maxUnderlineTime(): Time {
    return this.endTimeline.addMinutes(this.timestep)
  }

  createTimeline(step: number) {
    const scale = [this.startTimeline.clone()]
    const lastTimePoint = () => scale[scale.length - 1]
    while (lastTimePoint().hour < this.endTimeline.hour) {
      scale.push(lastTimePoint().addMinutes(step))
    }
    return scale
  }
}
