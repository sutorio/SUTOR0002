# `pscan`

## Overview

A small PWA for scanning barcodes of music CDs/records/tapes/&c., then taking
the results of the scans, looking them up, and using the lookup results to update
a small music database. Designed for mobile usage (though it should be *functional*
on desktop).

## Aims

### 1: Assess state of Web Components

I have studiously ignored Web Components for a few years now. Is it possible to
produce a functional, *maintainable*, reasonably complex application using them
out-of-the-box, with no additional dependencies?

I feel like the answer to this is "no", but worth a try (NOTE: move to solid-js
should this become too onerous).

### 2: Assess state of PWAs

Is it possible to ship a functional, maintainable and performant PWA, using only
the available web platform APIs? Again, I feel like the answer sits somewhere
in the area of "no", but at least should have something working on Android.

### 3. Assess ergonomics of WebWorkers again (possibly...)

Workers are a pain to deal with, and I'm not at all convinced by the RPC
implmentations (*c.f.* Comlink) that make usage of workers simpler [in some ways].
With this app, moving image processing off the main thread seems a reasonable
things to do, and I want to test out that thesis. Also, moving the processing
logic for querying external APIs & parsing the results & storing them in
IndexedDB (and sync-ing that with a cloud store) seems an interesting avenue
of exploration.

## Notes

### WC resources
- [Handy custom elements' patterns](https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4)
- [`handleEvent`](https://gist.github.com/WebReflection/35ca0e2ef2fb929143ea725f55bc0d63)
- [Why I use Web Components](https://gist.github.com/WebReflection/71aed0c811e2e88e3cd3c647213f0e6c)
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
