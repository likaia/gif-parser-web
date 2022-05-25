// 读取GIF的子数据块
export function readSubBlock(
  view: DataView,
  pos: number,
  read: boolean
): { data: string; size: number } {
  const subBlock = {
    data: "",
    size: 0
  };
  while (true) {
    const size = view.getUint8(pos + subBlock.size);
    if (size === 0) {
      subBlock.size++;
      break;
    }
    if (read) {
      // 将当前指针指向的数据块内容转为字符串数据
      subBlock.data += byteToString(view, size, pos + subBlock.size + 1);
    }
    subBlock.size += size + 1;
  }
  return subBlock;
}

export function byteToString(
  view: DataView,
  length: number,
  byteOffset: number
): string {
  let value = "";
  for (let i = 0; i < length; ++i) {
    const char = view.getUint8(byteOffset + i);
    value += String.fromCharCode(char > 127 ? 65533 : char);
  }
  return value;
}
