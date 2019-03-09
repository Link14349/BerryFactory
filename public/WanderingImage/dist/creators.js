"use strict";

WImage.addCreator(function fillCreator() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === undefined ? 0 : _ref$y,
        width = _ref.width,
        height = _ref.height,
        color = _ref.color;

    var _canvas = this.canvas(),
        cw = _canvas.width,
        ch = _canvas.height;

    width = width || cw;
    height = height || ch;
    var ctx = this.ctx();
    var d = ctx.createImageData(cw, ch);
    for (var i = y; i < y + height && i < ch; i++) {
        for (var j = x; j < x + width && j < cw; j++) {
            var p = i * cw + j;
            d.data[p * 4] = color.r;
            d.data[p * 4 + 1] = color.g;
            d.data[p * 4 + 2] = color.b;
            d.data[p * 4 + 3] = color.a;
        }
    }
    ctx.putImageData(d, 0, 0);
});
WImage.addCreator(function copyCreator() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$x = _ref2.x,
        x = _ref2$x === undefined ? 0 : _ref2$x,
        _ref2$y = _ref2.y,
        y = _ref2$y === undefined ? 0 : _ref2$y,
        width = _ref2.width,
        height = _ref2.height,
        image = _ref2.image;

    var _canvas2 = this.canvas(),
        cw = _canvas2.width,
        ch = _canvas2.height;

    width = width || cw;
    height = height || ch;
    var ctx = this.ctx();
    var d = ctx.createImageData(cw, ch);
    for (var i = y; i < y + height && i < ch; i++) {
        for (var j = x; j < x + width && j < cw; j++) {
            var p = i * cw + j;
            d.data[p * 4] = image[p * 4 + 0];
            d.data[p * 4 + 1] = image[p * 4 + 1];
            d.data[p * 4 + 2] = image[p * 4 + 2];
            d.data[p * 4 + 3] = image[p * 4 + 3];
        }
    }
    ctx.putImageData(d, 0, 0);
});
WImage.addCreator(function mathCreator() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref3$x = _ref3.x,
        x = _ref3$x === undefined ? 0 : _ref3$x,
        _ref3$y = _ref3.y,
        y = _ref3$y === undefined ? 0 : _ref3$y,
        width = _ref3.width,
        height = _ref3.height,
        math = _ref3.math;

    var _canvas3 = this.canvas(),
        cw = _canvas3.width,
        ch = _canvas3.height;

    width = width || cw;
    height = height || ch;
    var ctx = this.ctx();
    var d = ctx.createImageData(cw, ch);
    for (var i = y; i < y + height && i < ch; i++) {
        for (var j = x; j < x + width && j < cw; j++) {
            var p = i * cw + j;
            d.data[p * 4] = math.r(j, i);
            d.data[p * 4 + 1] = math.g(j, i);
            d.data[p * 4 + 2] = math.b(j, i);
            d.data[p * 4 + 3] = math.a(j, i);
        }
    }
    ctx.putImageData(d, 0, 0);
});
