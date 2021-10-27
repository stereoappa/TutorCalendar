import {ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay'
import {ComponentRef, ElementRef, Injectable, Injector} from '@angular/core'
import {TimetablePreviewComponent} from './timetable-preview.component'
import {ComponentPortal} from '@angular/cdk/portal'
import {Slot} from './timetable-column.component'

export class PreviewData {
  constructor(readonly datekeys: Array<number>,
              readonly datekey: number,
              readonly position: {top: number, height: number}) {
  }
}

export class TimetablePreviewOverlayRef {
  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.detach()
    this.overlayRef.dispose()
  }
}

@Injectable({providedIn: 'root'})
export class TimetablePreviewService {

  private _previewRef: TimetablePreviewOverlayRef

  private _overlayRef: OverlayRef

  private _connectedContainer: ElementRef<HTMLElement>

  private _component: TimetablePreviewComponent

  private _componentData: PreviewData

  private _containerRef: ComponentRef<TimetablePreviewComponent>

  private _containerPortal: ComponentPortal<TimetablePreviewComponent>

  constructor(private injector: Injector,
              private overlay: Overlay) { }

  setPreview(previewData: PreviewData = null, connectedContainer: ElementRef<HTMLElement>) {
    if (!previewData) {
      return
    }

    this._connectedContainer = connectedContainer
    this._componentData = previewData

    if (!this._overlayRef) {
      this._overlayRef = this.createOverlay()
    }

    if (!this._component) {
      this._previewRef = new TimetablePreviewOverlayRef(this._overlayRef)
      const injector = this.createInjector(this._componentData, this._previewRef)
      this._component = this.attachPreviewContainer(this._overlayRef, injector)
    } else {
      this._component.previewData = previewData
    }
  }

  getPreview(dateKey: number): Slot {
    this._componentData = null
    this._overlayRef.dispose()
    this._containerRef.destroy()
    this._previewRef = null
    this._containerRef = null
    const res = this._component._getSlotPreview(dateKey)[0]
    this._component = null
    return res
  }

  private createInjector(previewData: PreviewData, previewRef: TimetablePreviewOverlayRef): Injector {
    return Injector.create({ providers: [
        { provide: PreviewData, useValue: previewData },
        { provide: TimetablePreviewOverlayRef, useValue: previewRef }
      ]})
  }

  private createOverlay() {
    const overlayConfig = this.getOverlayConfig()
    return this.overlay.create(overlayConfig)
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this._connectedContainer)
      .withPositions(this.getPositions())
      .withPush(false)

    return new OverlayConfig({
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    })
  }



  private attachPreviewContainer(overlayRef: OverlayRef, injector: Injector) {
    this._containerPortal = new ComponentPortal(TimetablePreviewComponent, null, injector)

    this._containerRef = overlayRef.attach(this._containerPortal)

    return this._containerRef.instance
  }

  private getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
        panelClass: 'w-100'
      }
    ]
  }
}
