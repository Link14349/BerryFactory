class WImage
{
    constructor() {
        this.__finish = true;
        this.virtual();
    }
    bind(canvas) {
        this.__canvas = canvas;
        this.__ctx = canvas.getContext("2d");
    }
    ctx() {
        return this.__ctx;
    }
    canvas() {
        return this.__canvas;
    }
    virtual() {
        this.__canvas = document.createElement("canvas");
        this.__ctx = this.canvas().getContext("2d");
    }
    data() {
        return this.__ctx.getImageData(0, 0, this.canvas().width, this.canvas().height);
    }
    pushImage(image, {
        sx, sy, sw, sh, x = 0, y = 0, width, height
    } = {}, cb) {
        this.__finish = false;
        let picture = new Image();
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
        }
    }
    echo(cb, { x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height, async = true } = {}) {
        let self = this;
        function e() {
            let {width, height} = self.canvas();
            for (let i = y ; i < y + sh && i < height ; i++) {
                for (let j = x ; j < x + sw && j < width ; j++) {
                    if (i < 0 || j < 0) continue;
                    if (i >= height || j >= width) continue;
                    let p = i * width + j;
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
    create(creator) {
        let argv = [];
        for (let i = 1 ; i < arguments.length ; i++) {
            argv.push(arguments[i]);
        }
        this[creator + "Creator"](...argv);
    }
    filter(style) {
        let argv = [];
        for (let i = 1 ; i < arguments.length ; i++) {
            argv.push(arguments[i]);
        }
        this[style + "Filter"](...argv);
    }
    whileLoad(cb) {
        let checker = setInterval(function () {
            if (this.__finish) {
                cb(this);
                clearInterval(checker);
            }
        }.bind(this), 0);
    }
    insertText(text, x, y, font, style) {
        let ctx = this.ctx();
        if (font) ctx.font = font;
        if (style) ctx.fillStyle = style;
        ctx.fillText(text, x, y);
    }
    download(MIME_TYPE, filename) {
        let canvasElement = this.canvas();
        let imageURL = canvasElement.toDataURL(MIME_TYPE);
        let dlLink = document.createElement('a');
        dlLink.download = filename;
        dlLink.href = imageURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }
    static addFilter(fun, name = fun.name) {
        if (WImage.prototype[name]) {
            throw new Error("Filter function " + name + " is already in use. Please select another name.");
        }
        WImage.prototype[name] = fun;
    }
    static addCreator(fun, name = fun.name) {
        if (WImage.prototype[name]) {
            throw new Error("Creator function " + name + " is already in use. Please select another name.");
        }
        WImage.prototype[name] = fun;
    }
    static indexWithXY(x, y, width) {
        return y * width + x;
    }
}

WImage.colors = {
    RED: 0, GREEN: 1, BLUE: 2, ALPHA: 3,
};