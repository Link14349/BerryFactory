"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WImage = function () {
    function WImage() {
        _classCallCheck(this, WImage);

        this.__finish = true;
        this.virtual();
    }

    _createClass(WImage, [{
        key: "bind",
        value: function bind(canvas) {
            this.__canvas = canvas;
            this.__ctx = canvas.getContext("2d");
        }
    }, {
        key: "ctx",
        value: function ctx() {
            return this.__ctx;
        }
    }, {
        key: "canvas",
        value: function canvas() {
            return this.__canvas;
        }
    }, {
        key: "virtual",
        value: function virtual() {
            this.__canvas = document.createElement("canvas");
            this.__ctx = this.canvas().getContext("2d");
        }
    }, {
        key: "data",
        value: function data() {
            return this.__ctx.getImageData(0, 0, this.canvas().width, this.canvas().height);
        }
    }, {
        key: "pushImage",
        value: function pushImage(image) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                sx = _ref.sx,
                sy = _ref.sy,
                sw = _ref.sw,
                sh = _ref.sh,
                _ref$x = _ref.x,
                x = _ref$x === undefined ? 0 : _ref$x,
                _ref$y = _ref.y,
                y = _ref$y === undefined ? 0 : _ref$y,
                width = _ref.width,
                height = _ref.height;

            var cb = arguments[2];

            this.__finish = false;
            var picture = new Image();
            picture.src = image;
            picture.onload = function () {
                this.__finish = true;
                width = width || picture.width;
                height = height || picture.height;
                if (sx && sy && sw && sh) {
                    this.__ctx.drawImage(picture, sx, sy, sw, sh, x, y, width, height);
                } else {
                    this.__ctx.drawImage(picture, x, y, width, height);
                }
                if (typeof cb === "function") {
                    cb(this);
                }
            }.bind(this);
            picture.onerror = function () {
                console.error("WImage: Load image '" + image + "' failed.");
            };
        }
    }, {
        key: "echo",
        value: function echo(cb) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref2$x = _ref2.x,
                x = _ref2$x === undefined ? 0 : _ref2$x,
                _ref2$y = _ref2.y,
                y = _ref2$y === undefined ? 0 : _ref2$y,
                _ref2$sw = _ref2.sw,
                sw = _ref2$sw === undefined ? this.canvas().width : _ref2$sw,
                _ref2$sh = _ref2.sh,
                sh = _ref2$sh === undefined ? this.canvas().height : _ref2$sh,
                _ref2$async = _ref2.async,
                async = _ref2$async === undefined ? true : _ref2$async;

            var self = this;
            function e() {
                var _self$canvas = self.canvas(),
                    width = _self$canvas.width,
                    height = _self$canvas.height;

                for (var i = y; i < y + sh && i < height; i++) {
                    for (var j = x; j < x + sw && j < width; j++) {
                        if (i < 0 || j < 0) continue;
                        if (i >= height || j >= width) continue;
                        var p = i * width + j;
                        cb(j, i, p);
                    }
                }
            }
            if (async) {
                e();
            } else {
                setTimeout(function () {
                    e();
                }, 0);
            }
        }
    }, {
        key: "create",
        value: function create(creator) {
            var argv = [];
            for (var i = 1; i < arguments.length; i++) {
                argv.push(arguments[i]);
            }
            this[creator + "Creator"].apply(this, argv);
        }
    }, {
        key: "filter",
        value: function filter(style) {
            var argv = [];
            for (var i = 1; i < arguments.length; i++) {
                argv.push(arguments[i]);
            }
            this[style + "Filter"].apply(this, argv);
        }
    }, {
        key: "whileLoad",
        value: function whileLoad(cb) {
            var checker = setInterval(function () {
                if (this.__finish) {
                    cb(this);
                    clearInterval(checker);
                }
            }.bind(this), 0);
        }
    }, {
        key: "insertText",
        value: function insertText(text, x, y, font, style) {
            var ctx = this.ctx();
            if (font) ctx.font = font;
            if (style) ctx.fillStyle = style;
            ctx.fillText(text, x, y);
        }
    }, {
        key: "download",
        value: function download(MIME_TYPE, filename) {
            var canvasElement = this.canvas();
            var imageURL = canvasElement.toDataURL(MIME_TYPE);
            var dlLink = document.createElement('a');
            dlLink.download = filename;
            dlLink.href = imageURL;
            dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
        }
    }], [{
        key: "addFilter",
        value: function addFilter(fun) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : fun.name;

            if (WImage.prototype[name]) {
                throw new Error("Filter function " + name + " is already in use. Please select another name.");
            }
            WImage.prototype[name] = fun;
        }
    }, {
        key: "addCreator",
        value: function addCreator(fun) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : fun.name;

            if (WImage.prototype[name]) {
                throw new Error("Creator function " + name + " is already in use. Please select another name.");
            }
            WImage.prototype[name] = fun;
        }
    }, {
        key: "indexWithXY",
        value: function indexWithXY(x, y, width) {
            return y * width + x;
        }
    }]);

    return WImage;
}();

WImage.colors = {
    RED: 0, GREEN: 1, BLUE: 2, ALPHA: 3
};

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

