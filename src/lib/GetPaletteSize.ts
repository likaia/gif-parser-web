// 获取调色板大小
export function getPaletteSize(palette: Array<number>): number {
  return 3 * Math.pow(2, 1 + bitToInt(palette.slice(5, 8)));
}

// 获取每一帧gif的持续时间
export function getFrameDuration(duration: number): number {
  return (duration / 100) * 1000;
}

// 二进制转十进制
function bitToInt(bitArray: Array<number>) {
  return bitArray.reduce(function (s, n) {
    return s * 2 + n;
  }, 0);
}
