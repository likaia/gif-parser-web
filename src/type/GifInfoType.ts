export type gifInfoType = {
  // GIF的有效性
  valid: boolean;
  globalPalette: boolean;
  globalPaletteSize: number;
  // 全局调色板RGB信息数组
  globalPaletteColorsRGB: Array<{ r: number; g: number; b: number }>;
  loopCount: number;
  height: number;
  width: number;
  animated: boolean;
  images: Array<frameImageType>;
  // 帧标识（当前为第几帧画面）
  identifier: string;
  duration: number;
};

export type frameImageType = {
  identifier: string;
  localPalette: boolean;
  localPaletteSize: number;
  interlace: boolean;
  comments: Array<string>;
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
  delay: number;
  disposal: number;
};
