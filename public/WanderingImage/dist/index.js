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
