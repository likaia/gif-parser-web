# gif-parser-web · [![npm](https://img.shields.io/badge/npm-v1.0.5-2081C1)](https://www.npmjs.com/package/gif-parser-web) [![yarn](https://img.shields.io/badge/yarn-v1.0.5-F37E42)](https://yarnpkg.com/package/gif-parser-web) [![github](https://img.shields.io/badge/GitHub-depositary-9A9A9A)](https://github.com/likaia/gif-parser-web) [![](https://img.shields.io/github/issues/likaia/gif-parser-web)](https://github.com/likaia/gif-parser-web/issues) [![](	https://img.shields.io/github/forks/likaia/gif-parser-web)](``https://github.com/likaia/gif-parser-web/network/members) [![](	https://img.shields.io/github/stars/likaia/gif-parser-web)](https://github.com/likaia/gif-parser-web/stargazers)

## 写在前面
关于此插件的更多介绍以及实现原理请移步👉：[JS获取GIF总帧数](https://www.kaisir.cn/post/142)

## 插件安装
```bash
# yarn安装
yarn add gif-parser-web

# npm安装
npm install gif-parser-web --save
```

## 插件使用
由于插件采用原生js编写且不依赖任何第三方库，因此它可以在任意一台支持js的设备上运行。

### import形式使用插件
* 在需要获取Gif图像信息的业务代码中导入插件
```javascript
import GifParse from "gif-parser-web";
```
* 在业务代码中使用时实例化插件，调用对应的方法即可
```javascript
const gifParse = new GifParse("插件支持传入一个图像url作为可选参数");
const gifInfo = gifParse.getInfo("此处支持File类型的数据作为可选参数，如果传入则使用此处的参数作为gif数据源");
gifInfo.then((res)=>{
  console.log("解析完成", res);
})
```

### cdn形式使用插件
* 将插件的`dist`文件夹复制到你的项目中
* 使用`script`标签引入dist目录下的`gifParserPlugin.umd.js`文件
```javascript
<script src="./gifParserPlugin.umd.js"></script>
```
* 在业务代码中使用时实例化插件，调用对应的方法即可
```javascript
const gifParse = new gifParserPlugin("插件支持传入一个图像url作为可选参数");
const gifInfo = gifParse.getInfo("此处支持File类型的数据作为可选参数，如果传入则使用此处的参数作为gif数据源");
gifInfo.then((res)=>{
  console.log("解析完成", res);
})
```
> 注意⚠️：GitHub中是不会上传dist目录的，你想要自己将项目clone到本地，编译得到dist文件夹。
> 
>当然，你也可以直接下载[gifParserPlugin.umd.js](https://unpkg.com/gif-parser-web@1.0.5/dist/gifParserPlugin.umd.js)文件来使用


## 写在最后
至此，插件的使用方法就介绍完了。
