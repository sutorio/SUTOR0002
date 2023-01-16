import { ebus, type PscanEvent } from "./event-bus.js";
import { queryEan13 } from "./musicbrainz-facade.js"
import { MEDIA_CONSTRAINTS } from "./shared.js";

export class BarcodeLookup extends HTMLUListElement {
  #lookupHandler = async (e: PscanEvent<"detectorsuccess">) => {
    const containerEl = document.createElement("li")
    const codeEl = document.createElement("span")
    const resEl = document.createElement("span")
    containerEl.appendChild(codeEl)
    containerEl.appendChild(resEl)

    const code = e.payload[0].rawValue
    let toPrint: string;
    try {
      const lookup = await queryEan13(code)
      toPrint = JSON.stringify(lookup)
    } catch (err) {
      toPrint = JSON.stringify(err)
    }
    codeEl.appendChild(document.createTextNode(code))
    resEl.appendChild(document.createTextNode(toPrint))
    super.appendChild(containerEl)
  }

  connectedCallback() {
    ebus.addListener("detectorsuccess", this.#lookupHandler)
  }
}

customElements.define("barcode-lookup", BarcodeLookup, { extends: "ul" })

/**
 * A `video` element used to display the stream from the device camera..
 */
export class CameraStream extends HTMLVideoElement {
  connectedCallback() {
    super.setAttribute("autoplay", "");
    super.setAttribute("muted", "");
    navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS)
      .then((stream) => {
        super.srcObject = stream;
      })
      .catch((err) => {
        // Swallow the error, don't blow up
        console.warn(err);
        // `null` is an acceptable value here, will not error
        super.srcObject = null;
      });
  }
}

customElements.define("camera-stream", CameraStream, { extends: "video" })

/**
 * On detection of barcodes, the current frame is drawn to a `canvas` element.
 * This still frame can then have the area containing the detected highlighted.
 */
export class ResultFrame extends HTMLCanvasElement {
  #renderFrame = (e: PscanEvent<"framecaptured">) => {
    super.width = e.payload.width
    super.height = e.payload.height
    super.getContext("bitmaprenderer")?.transferFromImageBitmap(e.payload)
  }

  #clearFrame = () => {
    super.width = 0
    super.height = 0
  }

  connectedCallback() {
    this.#clearFrame()


    ebus.addListener("framecaptured", this.#renderFrame)
    ebus.addListener("startscanning", this.#clearFrame)
  }
}

customElements.define("result-frame", ResultFrame, { extends: "canvas" })

type ScanInitialiserState =
  | "loading" // The scanner logic is intialising
  | "errored" // The scanner logic init failed (terminal failure)
  | "ready" // The scanner can be used
  | "scanning"; // The scanner is operating

/**
 * A button that triggers scanning for barcodes. Note that this is the component
 * that initialises and runs the *actual* scanning logic -- *i.e.* constructing
 * the ImageCapture/BarcodeDetector/AbortController objects, then providing
 * event-triggered methods to scan/abort scanning.
 *
 * ---------------------------------------------------------------------------
 * DEV_NOTES: both the `ImageCapture` and `BarcodeDetection` web platform APIs
 * are **experimental** and are only available [unflagged] in Chrome -- even
 * then, Windows support is problematic.
 * See: [Barcode Detection API docs](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API)
 * See: [Image Capture API docs](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture)
 * TODO: the detector currently grabs every supported format (no "formats" are.
 * specified in the constructor). This is unecessary and only being used for initial dev. A check for support *may*
 * be sensible, but the `BarcodeDetector` ctor should be ran with only the required formats.
 * TODO: **Both APIs will need to be polyfilled**. This *may* require moving
 * processing to a Worker thread. This is probably a good idea anyway, but is a
 * pain in the arse to implement. Regarding Workers, see Firefox issue re module
 * workers (unflagged support is close): https://bugzilla.mozilla.org/show_bug.cgi?id=1247687
 * TODO: make the detection cancellable via an AbortController
 * PERF_REVIEW: performance degradation when repeatedly polling the detect method.
 */
export class ScanInitialiser extends HTMLButtonElement {
  #state: ScanInitialiserState = "loading";
  #captureDevice: ImageCapture | null = null;
  #barcodeDetector: BarcodeDetector | null = null;

  set state(newState: ScanInitialiserState) {
    this.#state = newState;
    super.dataset.state = newState;
  }

  get state() {
    return this.#state;
  }

  connectedCallback() {
    ebus.dispatch("detectorloading");

    navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS)
      .then((stream) => stream.getVideoTracks()[0])
      .then((track) => {
        this.#barcodeDetector = new BarcodeDetector();
        this.#captureDevice = new ImageCapture(track);

        ebus.dispatch("detectorready");
        this.state = "ready";
      })
      .catch((err: unknown) => {
        this.#barcodeDetector = null;
        this.#captureDevice = null;

        ebus.dispatch("detectorloaderror", err);
        this.state = "errored";
      })

    super.addEventListener("click", this)

    ebus.addListener("startscanning", () => {
      super.setAttribute("disabled", "")
      this.detect()
    })
    ebus.addListener("stopscanning", (_) => {
      super.removeAttribute("disabled")
      this.state = "ready"
    })
    ebus.addListener("continuescanning", (_) => {
      this.poll()
    })
  }

  handleEvent(e: Event) {
    switch (e.type) {
      case "click":
        ebus.dispatch("startscanning")
        break;
    }
  }

  poll = () => {
    if (this.state === "scanning") {
      setTimeout(() => this.detect(), 500)
    }
  }

  detect = async () => {
    try {
      // NOTE: at point `detect` is called, both of these properties will be
      // defined, but TS is not aware of this.
      if (this.#captureDevice && this.#barcodeDetector) {
        this.state = "scanning";
        const frame = await this.#captureDevice.grabFrame();
        const res = await this.#barcodeDetector.detect(frame);
        if (res.length > 0) {
          ebus.dispatch("framecaptured", frame)
          ebus.dispatch("detectorsuccess", res)
        } else {
          ebus.dispatch("continuescanning")
        }
      }
    } catch (err) {
      ebus.dispatch("detectorscanningerror")
    }
  }

  disconnectedCallback() {
    // TODO: remove ebus handlers
  }
}

customElements.define("scan-initialiser", ScanInitialiser, { extends: "button" })



/**
 * A button to manually cancel scanning.
 */
export class ScanTerminator extends HTMLButtonElement {
  connectedCallback() {
    super.setAttribute("disabled", "")

    super.addEventListener("click", (_) => {
      ebus.dispatch("stopscanning")
      super.setAttribute("disabled", "")
    })

    ebus.addListener("startscanning", (_) => {
      super.removeAttribute("disabled")
    })
  }

  disconnectedCallback() {
    // TODO: remove ebus handlers
  }
}

customElements.define("scan-terminator", ScanTerminator, { extends: "button" })
