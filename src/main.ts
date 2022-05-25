import type { gifInfoType } from "@/type/GifInfoType";
import { getBitArray } from "@/lib/GetBitArray";
import { getFrameDuration, getPaletteSize } from "@/lib/GetPaletteSize";
import { FrameImage } from "@/model/FrameImage";
import { byteToString, readSubBlock } from "@/lib/ReadSubBlock";
import { getGlobalPaletteInfo } from "@/lib/GetGlobalPalette";

export default class GifParser {
  private urlLoadStatus: boolean | undefined = undefined;
  private dataView: DataView | undefined;
  // 当前指向DataView的指针位置
  private pos = 0;
  // 当前解析的帧索引
  private index = 0;
  private gifInfo: gifInfoType = {
    valid: false,
    globalPalette: false,
    globalPaletteSize: 0,
    globalPaletteColorsRGB: [],
    loopCount: 0,
    height: 0,
    width: 0,
    animated: false,
    images: [],
    duration: 0,
    identifier: "0"
  };

  constructor(url?: string) {
    if (url) {
      this.urlLoadStatus = false;
      // 解析url，将其转化为DataView格式的数据
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          return new DataView(arrayBuffer);
        })
        .then((dataView) => {
          // GIF加载成功
          this.urlLoadStatus = true;
          this.dataView = dataView;
        });
    }
  }
  /**
   * 获取图像信息
   * @param gifStream
   */
  public async getInfo(gifStream?: File): Promise<gifInfoType> {
    // 参数有效性校验
    await this.validityCheck(gifStream);
    // url与gifStream都未传入则抛出异常
    if (this.dataView == null) {
      throw new Error("未找到GIF解析源, 请检查参数是否正确传入");
    }

    // 不解析GIF8格式的图像
    if (
      this.dataView.getUint16(0) != 0x4749 ||
      this.dataView.getUint16(2) != 0x4638
    ) {
      return this.gifInfo;
    }
    // 经过上述判断后，此时的GIF已经有效了
    this.gifInfo.valid = true;
    // 获取GIF图像的宽，高
    this.gifInfo.width = this.dataView.getUint16(6, true);
    this.gifInfo.height = this.dataView.getUint16(8, true);

    // 解析全局调色板
    const { pos, PaletteColorsRGB } = getGlobalPaletteInfo(
      this.dataView,
      this.gifInfo,
      this.pos
    );
    // 修改指针位置
    this.pos = pos;
    // 设置全局调色板
    this.gifInfo.globalPaletteColorsRGB = PaletteColorsRGB;

    // gif每一帧的图片描述
    let frame = new FrameImage();
    // 循环读取dataView, 读取gif每一帧的数据信息
    while (true) {
      try {
        const block = this.dataView.getUint8(this.pos);
        switch (block) {
          // 图形控制扩展
          case 0x21:
            this.parseGraphicsControlBlock(this.dataView, frame);
            break;
          // 图片描述块数据
          case 0x2c:
            frame.imageInfo.left = this.dataView.getUint16(this.pos + 1, true);
            frame.imageInfo.top = this.dataView.getUint16(this.pos + 3, true);
            frame.imageInfo.width = this.dataView.getUint16(this.pos + 5, true);
            frame.imageInfo.height = this.dataView.getUint16(
              this.pos + 7,
              true
            );
            const unpackedField = getBitArray(
              this.dataView.getUint8(this.pos + 9)
            );
            if (unpackedField[0]) {
              // 本地块数据
              const localPaletteSize = getPaletteSize(unpackedField);
              frame.imageInfo.localPalette = true;
              frame.imageInfo.localPaletteSize = localPaletteSize / 3;
              this.pos += localPaletteSize;
            }
            if (unpackedField[1]) {
              // 帧交错标识
              frame.imageInfo.interlace = true;
            }

            this.gifInfo.images.push(frame.imageInfo);
            this.index++;
            // 重置frame，继续下一轮解析
            frame = new FrameImage();
            frame.imageInfo.identifier = this.index.toString();

            // 判断当前GIF是否可以动
            if (this.gifInfo.images.length > 1 && !this.gifInfo.animated) {
              this.gifInfo.animated = true;
            }

            this.pos += 11;
            const subBlock = readSubBlock(this.dataView, this.pos, false);
            this.pos += subBlock.size;
            break;
          // 末尾数据块
          case 0x3b:
            return this.gifInfo;
          // 未知数据块
          default:
            this.pos++;
            break;
        }
      } catch (e) {
        this.gifInfo.valid = false;
        return this.gifInfo;
      }
    }
  }

  // 获取GIF加载状态
  private gifLoadStatus(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let time = 0;
      // 超时时间
      const defaultTimeOut = 5000;
      const timer = setInterval(() => {
        time += 100;
        // 请求超时
        if (time >= defaultTimeOut) {
          clearInterval(timer);
          resolve(false);
        }
        // 加载完毕
        if (this.urlLoadStatus === true) {
          clearInterval(timer);
          resolve(true);
        }
      }, 100);
    });
  }

  // 图形控制块数据解析
  private parseGraphicsControlBlock(dataView: DataView, frame: FrameImage) {
    const type = dataView.getUint8(this.pos + 1);
    // 图形控制块
    if (type === 0xf9) {
      const length = dataView.getUint8(this.pos + 2);
      if (length === 4) {
        const delay = getFrameDuration(dataView.getUint16(this.pos + 4, true));
        frame.imageInfo.delay = delay;
        // gif总时长自增
        this.gifInfo.duration += delay;

        const unpackedField = getBitArray(dataView.getUint8(this.pos + 3));
        const disposal = unpackedField.slice(3, 6).join("");
        frame.imageInfo.disposal = parseInt(disposal, 2);

        this.pos += 8;
        return;
      }
      this.pos++;
      return;
    }
    // 非图形控制块
    this.pos += 2;
    // 获取子模块，做进一步解析
    const subBlock = readSubBlock(dataView, this.pos, true);
    switch (type) {
      // 应用扩展块数据
      case 0xff:
        const identifier = byteToString(dataView, 8, this.pos + 1);
        // 可能会出现多个应用程序扩展块，我们需要确保仅在标识符为 NETSCAPE 时处理GIF循环次数
        if (identifier === "NETSCAPE") {
          this.gifInfo.loopCount = dataView.getUint8(this.pos + 14);
        }
        break;
      // 帧标识块数据
      case 0xce:
        frame.imageInfo.identifier = subBlock.data;
        break;
      // 解释块数据
      case 0xfe:
        frame.imageInfo.comments.push(subBlock.data);
        break;
      // 纯文本扩展块数据
      case 0x01:
        frame.imageInfo.text = subBlock.data;
        break;
      default:
        break;
    }
    this.pos += subBlock.size;
  }

  // gif文件流有效性校验
  private async validityCheck(gifStream: File | undefined) {
    if (typeof this.urlLoadStatus !== "undefined" && !this.urlLoadStatus) {
      // 等待url加载成功
      const loadResult = await this.gifLoadStatus();
      if (!loadResult) {
        throw new Error("GIF加载超时");
      }
    }
    // 如果文件流存在则使用gifStream参数作为解析源
    if (gifStream) {
      const gifBuffer = await gifStream.arrayBuffer();
      // 字节长度必须大于10才能继续解析
      if (gifBuffer.byteLength < 10) return this.gifInfo;
      this.dataView = new DataView(gifBuffer);
    }
  }
}
