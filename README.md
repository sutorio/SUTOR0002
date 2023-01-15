# `pscan`

## Overview

A small PWA for scanning barcodes of music CDs/records/tapes/&c., then taking
the results of the scans, looking them up, and using the lookup results to update
a small music database. Designed for mobile usage (though it should be *functional*
on desktop).

## Notes

### WC resources
- [Awesome web components](https://github.com/web-padawan/awesome-web-components)
- [Web Components gold standard](https://github.com/webcomponents/gold-standard/wiki)

### TS Resources

- Need some subclassing of existing DOM API resources, so quick reference to [TS DOM lib](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts)


## Running in dev

The app uses Vite for development/building, and is written in Typescript.

> NOTE: the app uses two web platform APIs that do not have full [unflagged] support
> outside of Chrome: the Barcode Detection API and the Image Capture API. These
> will be polyfilled going forwards, but currently desktop dev must occur on Chrome
> (and even then, not on Windows). When build and ran on mobile, the scanning part
> of the app will only work on Android (and even then, only native webview + Chrome).

> NOTE: to allow image capture/barcode detection, the app **must** be ran in
> a secure context (*ie* over HTTPS). For this reason, in development, the Vite
> [SSL plugin]() is being used. This will cause your browser to throw up a warning
> screen asking if you wish to continue when the app is opened.
