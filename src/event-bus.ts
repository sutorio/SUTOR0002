export interface PscanEventMap {
  "detectorloading": undefined,
  "detectorloaderror": unknown,
  "detectorready": undefined,
  "detectorscanning": undefined,
  "detectorscanningerror": Error,
  "detectorsuccess": DetectedBarcode[],
  "continuescanning": undefined,
  "framecaptured": ImageBitmap,
  "startscanning": undefined,
  "stopscanning": undefined,
}

export type PscanEventType = keyof PscanEventMap
export type PscanEventPayload<T extends PscanEventType> = PscanEventMap[T]
export type PscanEventHandler<T extends PscanEventType> = (e: PscanEvent<T>) => void


export class PscanEvent<T extends PscanEventType> extends Event {
  payload?: PscanEventPayload<T>

  constructor(type: PscanEventType, payload?: PscanEventPayload<T>) {
    super(type)
    this.payload = payload
  }
}

class EventBus<T extends PscanEventType> extends EventTarget {
  dispatch(type: T, payload?: PscanEventPayload<T>) {
    const e = new PscanEvent(type, payload)
    console.log(`Pscan Event: ${type}`, e)
    this.dispatchEvent(e)
  }

  addListener(type: T, listener: (e: PscanEvent<T>) => void, opts?: EventListenerOptions) {
    this.addEventListener(type, listener, opts)
  }

  removeListener(type: T, listener: (e: PscanEvent<T>) => void) {
    this.removeEventListener(type, listener)
  }
}

export const ebus = new EventBus()
