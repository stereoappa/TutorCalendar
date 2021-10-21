import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core'
import {Time, TimeRange} from './time-model'
import {TimetableSlotPreview, TimetableUserEvent} from './timetable-column.component'

export class ColumnDay<D = any> {
  constructor(public value: number,
              public title: string,
              public weekday: { long: string, narrow: string },
              public datekey: number,
              public rawValue: D,
              public slots: Slot[] = []) {
  }
}

export interface ISlotPosition {
  top: number,
  height: number
}

export class SlotPreview {
  constructor(readonly timeRange: TimeRange | null) {
  }
}

export class Slot extends SlotPreview {
  constructor(readonly title: string | null,
              readonly subTitle: string | null,
              readonly position: ISlotPosition) {
    super(null)
  }
}

const DEFAULT_TIMESTEP = 60

const DEFAULT_SLOT_PRECISION = DEFAULT_TIMESTEP / 2

const DEFAULT_PREVIEW_PRECISION = DEFAULT_SLOT_PRECISION / 2

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent<D> implements OnInit {

  @ViewChild('timeline') timelineRef: ElementRef<HTMLElement>

  @Input() timestep: number = DEFAULT_TIMESTEP

  @Input() columns: ColumnDay<D>[] | null

  @Input() startTimeline: Time

  @Input() endTimeline: Time

  @Output() readonly previewChange =
    new EventEmitter<TimetableUserEvent<SlotPreview>>()

  timePoints: Time[]

  constructor() { }

  ngOnInit(): void {
    this._createTimePoints()
  }

  _createTimePoints() {
    const scale = [this.startTimeline.clone()]
    const lastTimePoint = () => scale[scale.length - 1]
    while (lastTimePoint().hour < this.endTimeline.hour) {
      scale.push(lastTimePoint().addMinutes(this.timestep))
    }
    this.timePoints = scale
  }

  _previewChanged(event: TimetableUserEvent<TimetableSlotPreview | null>) {
    this.previewChange.emit({
      value: new SlotPreview(new TimeRange(this._getTime(event.value.clientY, DEFAULT_PREVIEW_PRECISION), null)),
      datekey: event.datekey,
      event: event.event
    })
  }

  private _getTime(clientY: number, precision: number = DEFAULT_SLOT_PRECISION): Time | null {
    const timePointsRect = this.timelineRef.nativeElement.getBoundingClientRect()

    const timelineOffsetY = Math.floor(clientY - timePointsRect.top)
    const timePointHeightPx = Math.round(timePointsRect.height / this.timePoints.length)

    const selectedPointRatio = (timelineOffsetY / timePointHeightPx)
    const selectedTimePoint = this.timePoints[Math.trunc(selectedPointRatio)]

    const selectedPointMinuteRatio = selectedPointRatio - Math.trunc(selectedPointRatio)
    const selectedMinutes = Math.trunc(selectedPointMinuteRatio % 1 * this.timestep)

    const selectedTime = selectedTimePoint.addMinutes(selectedMinutes)

    const selectedMinutesWithPrecision = Math.trunc(selectedTime.minute / precision) * precision

    return new Time(selectedTime.hour, selectedMinutesWithPrecision)
  }
}
