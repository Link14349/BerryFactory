"use strict";

WImage.addFilter(function greyWeightFilter() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === undefined ? 0 : _ref$y,
        _ref$sw = _ref.sw,
        sw = _ref$sw === undefined ? this.canvas().width : _ref$sw,
        _ref$sh = _ref.sh,
        sh = _ref$sh === undefined ? this.canvas().height : _ref$sh;

    var d = this.data();
    var ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        var grey = d.data[p * 4] * 0.3 + d.data[p * 4 + 1] * 0.59 + d.data[p * 4 + 2] * 0.11;
        d.data[p * 4] = grey;
        d.data[p * 4 + 1] = grey;
        d.data[p * 4 + 2] = grey;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function greyFilter() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$x = _ref2.x,
        x = _ref2$x === undefined ? 0 : _ref2$x,
        _ref2$y = _ref2.y,
        y = _ref2$y === undefined ? 0 : _ref2$y,
        _ref2$sw = _ref2.sw,
        sw = _ref2$sw === undefined ? this.canvas().width : _ref2$sw,
        _ref2$sh = _ref2.sh,
        sh = _ref2$sh === undefined ? this.canvas().height : _ref2$sh;

    this.greyWeightFilter({ x: x, y: y, sw: sw, sh: sh });
});
WImage.addFilter(function greyComponentFilter() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref3$x = _ref3.x,
        x = _ref3$x === undefined ? 0 : _ref3$x,
        _ref3$y = _ref3.y,
        y = _ref3$y === undefined ? 0 : _ref3$y,
        _ref3$sw = _ref3.sw,
        sw = _ref3$sw === undefined ? this.canvas().width : _ref3$sw,
        _ref3$sh = _ref3.sh,
        sh = _ref3$sh === undefined ? this.canvas().height : _ref3$sh,
        _ref3$type = _ref3.type,
        type = _ref3$type === undefined ? "r" : _ref3$type;

    var d = this.data();
    var ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        var grey = d.data[p * 4];
        if (type == "g") grey = d.data[p * 4 + 1];
        if (type == "b") grey = d.data[p * 4 + 2];
        d.data[p * 4] = grey;
        d.data[p * 4 + 1] = grey;
        d.data[p * 4 + 2] = grey;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function greyMaxFilter() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref4$x = _ref4.x,
        x = _ref4$x === undefined ? 0 : _ref4$x,
        _ref4$y = _ref4.y,
        y = _ref4$y === undefined ? 0 : _ref4$y,
        _ref4$sw = _ref4.sw,
        sw = _ref4$sw === undefined ? this.canvas().width : _ref4$sw,
        _ref4$sh = _ref4.sh,
        sh = _ref4$sh === undefined ? this.canvas().height : _ref4$sh;

    var d = this.data();
    var ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        var grey = Math.max(d.data[p * 4], d.data[p * 4 + 1], d.data[p * 4 + 2]);
        d.data[p * 4] = grey;
        d.data[p * 4 + 1] = grey;
        d.data[p * 4 + 2] = grey;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function greyAverageFilter() {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref5$x = _ref5.x,
        x = _ref5$x === undefined ? 0 : _ref5$x,
        _ref5$y = _ref5.y,
        y = _ref5$y === undefined ? 0 : _ref5$y,
        _ref5$sw = _ref5.sw,
        sw = _ref5$sw === undefined ? this.canvas().width : _ref5$sw,
        _ref5$sh = _ref5.sh,
        sh = _ref5$sh === undefined ? this.canvas().height : _ref5$sh;

    var d = this.data();

    var _canvas = this.canvas(),
        width = _canvas.width,
        height = _canvas.height;

    var ctx = this.canvas().getContext("2d");
    for (var i = y; i < y + sh && i < height; i++) {
        for (var j = x; j < x + sw && j < width; j++) {
            var p = i * width + j;
            var grey = d.data[p * 4] + d.data[p * 4 + 1] + d.data[p * 4 + 2];
            grey /= 3;
            d.data[p * 4] = grey;
            d.data[p * 4 + 1] = grey;
            d.data[p * 4 + 2] = grey;
        }
    }
    ctx.putImageData(d, 0, 0);
});

WImage.addFilter(function blackWhiteFilter() {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref6$x = _ref6.x,
        x = _ref6$x === undefined ? 0 : _ref6$x,
        _ref6$y = _ref6.y,
        y = _ref6$y === undefined ? 0 : _ref6$y,
        _ref6$sw = _ref6.sw,
        sw = _ref6$sw === undefined ? this.canvas().width : _ref6$sw,
        _ref6$sh = _ref6.sh,
        sh = _ref6$sh === undefined ? this.canvas().height : _ref6$sh;

    var d = this.data();
    var ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        var grey = d.data[p * 4] * 0.3 + d.data[p * 4 + 1] * 0.59 + d.data[p * 4 + 2] * 0.11;
        if (grey > 225.5) {
            grey = 255;
        } else {
            grey = 0;
        }
        d.data[p * 4] = grey;
        d.data[p * 4 + 1] = grey;
        d.data[p * 4 + 2] = grey;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});

WImage.addFilter(function reverseFilter() {
    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref7$x = _ref7.x,
        x = _ref7$x === undefined ? 0 : _ref7$x,
        _ref7$y = _ref7.y,
        y = _ref7$y === undefined ? 0 : _ref7$y,
        _ref7$sw = _ref7.sw,
        sw = _ref7$sw === undefined ? this.canvas().width : _ref7$sw,
        _ref7$sh = _ref7.sh,
        sh = _ref7$sh === undefined ? this.canvas().height : _ref7$sh;

    var d = this.data();
    var ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        d.data[p * 4] = 255 - d.data[p * 4];
        d.data[p * 4 + 1] = 255 - d.data[p * 4 + 1];
        d.data[p * 4 + 2] = 255 - d.data[p * 4 + 2];
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});

WImage.addFilter(function blurFilter() {
    var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref8$x = _ref8.x,
        x = _ref8$x === undefined ? 0 : _ref8$x,
        _ref8$y = _ref8.y,
        y = _ref8$y === undefined ? 0 : _ref8$y,
        _ref8$sw = _ref8.sw,
        sw = _ref8$sw === undefined ? this.canvas().width : _ref8$sw,
        _ref8$sh = _ref8.sh,
        sh = _ref8$sh === undefined ? this.canvas().height : _ref8$sh,
        _ref8$degree = _ref8.degree,
        degree = _ref8$degree === undefined ? 1 : _ref8$degree;

    var d = this.data();
    var tmpd = this.data();

    var _canvas2 = this.canvas(),
        width = _canvas2.width,
        height = _canvas2.height;

    var ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        var color = {
            r: 0, g: 0, b: 0
        };
        for (var dx = -degree; dx <= degree; dx++) {
            for (var dy = -degree; dy <= degree; dy++) {
                var _x9 = j + dx;
                var _y = i + dy;
                if (_x9 < 0 || _y < 0) continue;
                if (_x9 >= width || _y >= height) continue;
                var _p = WImage.indexWithXY(_x9, _y, width);
                color.r += tmpd.data[_p * 4];
                color.g += tmpd.data[_p * 4 + 1];
                color.b += tmpd.data[_p * 4 + 2];
            }
        }
        var rectSize = Math.pow(2 * degree + 1, 2);
        color.r /= rectSize;
        color.g /= rectSize;
        color.b /= rectSize;
        d.data[p * 4] = color.r;
        d.data[p * 4 + 1] = color.g;
        d.data[p * 4 + 2] = color.b;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function mosaicFilter() {
    var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref9$x = _ref9.x,
        x = _ref9$x === undefined ? 0 : _ref9$x,
        _ref9$y = _ref9.y,
        y = _ref9$y === undefined ? 0 : _ref9$y,
        _ref9$sw = _ref9.sw,
        sw = _ref9$sw === undefined ? this.canvas().width : _ref9$sw,
        _ref9$sh = _ref9.sh,
        sh = _ref9$sh === undefined ? this.canvas().height : _ref9$sh,
        _ref9$degree = _ref9.degree,
        degree = _ref9$degree === undefined ? 5 : _ref9$degree;

    var d = this.data();
    var tmpd = this.data();

    var _canvas3 = this.canvas(),
        width = _canvas3.width,
        height = _canvas3.height;

    var ctx = this.canvas().getContext("2d");
    for (var i = y; i < y + sh && i < height; i += degree) {
        for (var j = x; j < x + sw && j < width; j += degree) {
            var p = i * width + j;
            var color = {
                r: 0, g: 0, b: 0
            };
            if (i < 0 || j < 0) continue;
            if (i >= height || j >= width) continue;
            for (var dx = 0; dx < degree; dx++) {
                for (var dy = 0; dy < degree; dy++) {
                    var _x11 = j + dx;
                    var _y2 = i + dy;
                    if (dy < 0 || dx < 0) continue;
                    if (dy >= height || dx >= width) continue;
                    var _p2 = WImage.indexWithXY(_x11, _y2, width);
                    color.r += tmpd.data[_p2 * 4];
                    color.g += tmpd.data[_p2 * 4 + 1];
                    color.b += tmpd.data[_p2 * 4 + 2];
                }
            }
            var rectSize = Math.pow(degree, 2);
            color.r /= rectSize;
            color.g /= rectSize;
            color.b /= rectSize;
            for (var _dx = 0; _dx < degree; _dx++) {
                for (var _dy = 0; _dy < degree; _dy++) {
                    var _x12 = j + _dx;
                    var _y3 = i + _dy;
                    if (_dy < 0 || _dx < 0) continue;
                    if (_dy >= height || _dx >= width) continue;
                    var _p3 = WImage.indexWithXY(_x12, _y3, width);
                    d.data[_p3 * 4] = color.r;
                    d.data[_p3 * 4 + 1] = color.g;
                    d.data[_p3 * 4 + 2] = color.b;
                }
            }
        }
    }
    ctx.putImageData(d, 0, 0);
});

WImage.addFilter(function posterFilter() {
    var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref10$x = _ref10.x,
        x = _ref10$x === undefined ? 0 : _ref10$x,
        _ref10$y = _ref10.y,
        y = _ref10$y === undefined ? 0 : _ref10$y,
        _ref10$sw = _ref10.sw,
        sw = _ref10$sw === undefined ? this.canvas().width : _ref10$sw,
        _ref10$sh = _ref10.sh,
        sh = _ref10$sh === undefined ? this.canvas().height : _ref10$sh;

    var d = this.data();
    var ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        d.data[p * 4] = d.data[p * 4] & 0xe0;
        d.data[p * 4 + 1] = d.data[p * 4 + 1] & 0xe0;
        d.data[p * 4 + 2] = d.data[p * 4 + 2] & 0xe0;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function shieldFilter() {
    var _ref11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref11$x = _ref11.x,
        x = _ref11$x === undefined ? 0 : _ref11$x,
        _ref11$y = _ref11.y,
        y = _ref11$y === undefined ? 0 : _ref11$y,
        _ref11$sw = _ref11.sw,
        sw = _ref11$sw === undefined ? this.canvas().width : _ref11$sw,
        _ref11$sh = _ref11.sh,
        sh = _ref11$sh === undefined ? this.canvas().height : _ref11$sh,
        _ref11$shields = _ref11.shields,
        shields = _ref11$shields === undefined ? [] : _ref11$shields;

    var d = this.data();
    var ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = shields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var a = _step.value;

                d.data[p * 4 + a] = 0;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
