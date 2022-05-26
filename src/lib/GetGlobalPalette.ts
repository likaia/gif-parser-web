import { getBitArray } from "@/lib/GetBitArray";
import { getPaletteSize } from "@/lib/GetPaletteSize";
import { gifInfoType } from "@/type/GifInfoType";

/**
 * 获取全局调色板信息
 * @param dataView
 * @param gifInfo
 * @param pos
 */
export function getGlobalPaletteInfo(
  dataView: DataView,
  gifInfo: gifInfoType,
  pos: number
): {
  pos: number;
  PaletteColorsRGB: Array<{ r: number; g: number; b: number }>;
} {
  const PaletteColorsRGB = [];
  // 解析全局调色板
  const unpackedField = getBitArray(dataView.getUint8(10));
  if (unpackedField[0]) {
    const globalPaletteSize = getPaletteSize(unpackedField);
    gifInfo.globalPalette = true;
    // 计算全局调色板的大小
    gifInfo.globalPaletteSize = globalPaletteSize / 3;
    // 调整指针位置
    pos += globalPaletteSize;
    // 遍历获取此块区域的所有颜色并存起来
    for (let i = 0; i < gifInfo.globalPaletteSize; i++) {
      const palettePos = 13 + i * 3;
      const r = dataView.getUint8(palettePos);
      const g = dataView.getUint8(palettePos + 1);
      const b = dataView.getUint8(palettePos + 2);
      PaletteColorsRGB.push({ r, g, b });
    }
  }
  pos += 13;
  return {
    pos,
    PaletteColorsRGB
  };
}
