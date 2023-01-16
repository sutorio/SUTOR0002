/**
 * `getUserMedia`, the method used to grab the `MediaStream` object from a
 * user's device camera, requires a set of constraints be passed specifying the
 * definition of the media steam to be accessed. In this case, no audio, just
 * an external-facing camera.
 *
 * `ideal` has been used rather than `exact` for the facing mode because laptops
 * generally do not have an externally-facing camera, thus making life difficult
 * during development unless the result falls back to any available camera.
 * ---------------------------------------------------------------------------
 * DEV_NOTES: for API docs, see:
 * [`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
 */
export const MEDIA_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: {
      ideal: "environment",
    },
  },
}
