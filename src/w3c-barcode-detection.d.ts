type SupportedBarcodeFormatTypes =
  | "aztec"
  | "code_128"
  | "code_39"
  | "code_93"
  | "data_matrix"
  | "ean_13"
  | "ean_8"
  | "itf"
  | "pdf417"
  | "qr_code"
  | "upc_e"

type Point = { x: number, y: number }

interface DetectedBarcode {
  boundingBox: DOMRectReadOnly;
  cornerPoints: [Point, Point, Point, Point];
  format: SupportedBarcodeFormatTypes;
  rawValue: string;
}

declare class BarcodeDetector {
  constructor(opts?: { formats: SupportedBarcodeFormatTypes[] })
  static getSupportedFormats: () => Promise<SupportedBarcodeFormatTypes[]>
  detect: (input: ImageBitmapSource) => Promise<DetectedBarcode[]>
}
