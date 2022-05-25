import { frameImageType } from "@/type/GifInfoType";

export class FrameImage {
  public imageInfo: frameImageType;

  constructor() {
    this.imageInfo = {
      identifier: "0", // 帧标识（当前为第几帧画面）
      localPalette: false,
      localPaletteSize: 0,
      interlace: false,
      comments: [],
      text: "",
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      delay: 0,
      disposal: 0
    };
  }
}
