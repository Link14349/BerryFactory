# WanderingImage
这是一个轻量级的图像处理类库，可以进行比较简单的图像操作(比如滤镜、添加文字等等)

## 环境
### 本地
[release/WanderingImage-v1.0.0.js](release/WanderingImage-v1.0.0.js) _开发调试使用_
[release/WanderingImage-v1.0.0.min.js](release/WanderingImage-v1.0.0.min.js) _客户端使用_
### CDN
[https://raw.githubusercontent.com/qianduanXIAOHAOZI/WanderingImage/master/release/WanderingImage-v1.0.0.js](https://raw.githubusercontent.com/qianduanXIAOHAOZI/WanderingImage/master/release/WanderingImage-v1.0.0.js) _开发调试使用_
[https://raw.githubusercontent.com/qianduanXIAOHAOZI/WanderingImage/master/release/WanderingImage-v1.0.0.min.js](https://raw.githubusercontent.com/qianduanXIAOHAOZI/WanderingImage/master/release/WanderingImage-v1.0.0.min.js) _客户端使用_

## 使用
### Hello world
```javascript
let image = new WImage();
let canvas = document.getElementById("image");
image.bind(canvas);
image.pushImage("image.png", function () {
    image.insertText("Hello world!", 0, 0);
});
```
### 滤镜
样例  
```javascript
let image = new WImage();
let canvas = document.getElementById("image");
image.bind(canvas);
image.pushImage("image.png", function () {
    image.filter("poster");
});
```
### 公共参数
```
option {
    x, y, sw, sh
}
```
- x _设置开始处理图像的x位置 (默认为0)_
- y _设置开始处理图像的y位置 (默认为0)_
- sw _设置处理图像宽度 (默认为canvas的宽度)_
- sh _设置处理图像高度 (默认为canvas的高度)_

### 个别参数
#### degree
blur, mosaic
- blur _设置模糊半径 (默认为1)_
- mosaic _设置马赛克方块大小 (默认为5)_
#### type
greyComponent
- greyComponent _设置分量(r, g或者b)_
#### shields
shield
- shield _设置屏蔽分量(0, 1, 2或者3; 即WImage.colors中的值)_

### 使用滤镜
我们用filter函数来进行滤镜的调用  
第一个参数是滤镜名称, 后面的参数是给滤镜函数调用的参数
#### 系统已定义滤镜
- greyWeight _灰度滤镜 (权重法)_
- grey _同greyWeight_
- greyComponent _使用指定分量灰度滤镜_
- greyMax _使用最大分量灰度滤镜_
- greyAverage _使用平均分量灰度滤镜_
- blackWhite _使用黑白滤镜_
- reverse _使用反色滤镜_
- blur _使用模糊滤镜 (高斯模糊)_
- mosaic _使用马赛克滤镜_
- poster _使用海报化滤镜_
- shield _使用屏蔽分量滤镜_

#### 自定义滤镜
使用static函数addFilter进行添加滤镜函数  
第一个参数是滤镜函数, 第二个是该函数的名字(可省略, 默认为第一个参数的name属性)  
__注意: 滤镜函数必须以Filter结尾，否则系统会找不到该滤镜函数!__  

样例  
```javascript
let image = new WImage();
let canvas = document.getElementById("image");
image.bind(canvas);
WImage.addFilter(function testFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height } = {}) {
    let d = this.data();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        d.data[p * 4] = 255;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
image.pushImage("image.png", function () {
    image.filter("test");
});
```

### 使用创建器
### 创建器是什么?
创建器就是一个可以将一定范围内的图像区域根据一系列规则设置颜色  
样例  
```javascript
let image = new WImage();
let canvas = document.getElementById("image");
image.bind(canvas);
image.pushImage("image.png", function () {
    image.create("fill", {
        color: { r: 255, g: 0, b: 0, a: 255 }
    });
});
```

### 公共参数
```
option {
    x, y, width, height
}
```
- x _设置开始处理图像的x位置 (默认为0)_
- y _设置开始处理图像的y位置 (默认为0)_
- width _设置处理图像宽度 (默认为canvas的宽度)_
- height _设置处理图像高度 (默认为canvas的高度)_

### 个别参数
#### color
fill  
- fill _填充的颜色_
#### image
copy
- copy _设置要拷贝过来的imageData_
#### math
math
- math _有四个颜色函数(r, g, b, a), 这些函数需要根据x, y值返回颜色 _

### 使用创建器
我们用create函数来进行滤镜的调用  
第一个参数是创建器名称, 后面的参数是给创建器函数调用的参数

#### 系统已定义创建器
- fill _填充颜色到指定区域_
- copy _拷贝imageData到指定区域_
- math _使用数学方法来指定每个点的颜色_

#### 自定义创建器
使用static函数addCreator进行添加滤镜函数  
第一个参数是创建器函数, 第二个是该函数的名字(可省略, 默认为第一个参数的name属性)  
__注意: 创建器函数必须以Creator结尾，否则系统会找不到该创建器函数!__  

样例  
```javascript
let image = new WImage();
let canvas = document.getElementById("image");
image.bind(canvas);
WImage.addCreator(function testCreator({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height } = {}) {
    let d = this.data();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        d.data[p * 4] = 255;
        d.data[p * 4 + 1] = 255;
        d.data[p * 4 + 2] = 255;
        d.data[p * 4 + 3] = 255;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
image.pushImage("image.png", function () {
    image.create("test");
});
```

## 许可
[MIT License](LICENSE)
