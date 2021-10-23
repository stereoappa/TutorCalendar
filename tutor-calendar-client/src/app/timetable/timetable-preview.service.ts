import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay'
import {Injectable} from '@angular/core'
import {TimetablePreviewComponent} from './timetable-preview.component'
import {ComponentPortal} from '@angular/cdk/portal'

interface TimetablePreviewConfig {
  hasBackdrop?: boolean
  backdropClass?: string
}

const DEFAULT_CONFIG: TimetablePreviewConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop'
}

export class TimetablePreviewOverlayRef {
  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose()
  }
}

@Injectable({providedIn: 'root'})
export class TimetablePreviewService {
  constructor(private overlay: Overlay) { }

  open(config: TimetablePreviewConfig = {}): TimetablePreviewOverlayRef {
    const previewConfig = { ...DEFAULT_CONFIG, ...config }

    // Returns an OverlayRef (which is a PortalHost)
    const overlayRef = this.createOverlay(previewConfig)

    const previewRef = new TimetablePreviewOverlayRef(overlayRef)

    const componentPortal = new ComponentPortal(TimetablePreviewComponent)

    overlayRef.attach(componentPortal)

    return previewRef
  }

  private createOverlay(config: TimetablePreviewConfig) {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(config)

    // Returns an OverlayRef
    return this.overlay.create(overlayConfig)
  }

  private getOverlayConfig(config: TimetablePreviewConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically()

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    })

    return overlayConfig
  }
}
