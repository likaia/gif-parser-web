// 获取二进制数组
export function getBitArray(val: number): Array<number> {
  const bits = [];
  for (let i = 7; i >= 0; i--) {
    bits.push(val & (1 << i) ? 1 : 0);
  }
  return bits;
}
