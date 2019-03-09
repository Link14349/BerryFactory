WImage.addFilter(function greyWeightFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height } = {}) {
    let d = this.data();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        let grey = d.data[p * 4] * 0.3 + d.data[p * 4 + 1] * 0.59 + d.data[p * 4 + 2] * 0.11;
        d.data[p * 4] = grey;
        d.data[p * 4 + 1] = grey;
        d.data[p * 4 + 2] = grey;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function greyFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height } = {}) {
    this.greyWeightFilter({ x: x, y: y, sw: sw, sh: sh });
});
WImage.addFilter(function greyComponentFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height, type = "r" } = {}) {
    let d = this.data();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        let grey = d.data[p * 4];
        if (type == "g") grey = d.data[p * 4 + 1];
        if (type == "b") grey = d.data[p * 4 + 2];
        d.data[p * 4] = grey;
        d.data[p * 4 + 1] = grey;
        d.data[p * 4 + 2] = grey;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function greyMaxFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height } = {}) {
    let d = this.data();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        let grey = Math.max(d.data[p * 4], d.data[p * 4 + 1], d.data[p * 4 + 2]);
        d.data[p * 4] = grey;
        d.data[p * 4 + 1] = grey;
        d.data[p * 4 + 2] = grey;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function greyAverageFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height } = {}) {
    let d = this.data();
    let {width, height} = this.canvas();
    let ctx = this.canvas().getContext("2d");
    for (let i = y ; i < y + sh && i < height ; i++) {
        for (let j = x ; j < x + sw && j < width ; j++) {
            let p = i * width + j;
            let grey = d.data[p * 4] + d.data[p * 4 + 1] + d.data[p * 4 + 2];
            grey /= 3;
            d.data[p * 4] = grey;
            d.data[p * 4 + 1] = grey;
            d.data[p * 4 + 2] = grey;
        }
    }
    ctx.putImageData(d, 0, 0);
});

WImage.addFilter(function blackWhiteFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height } = {}) {
    let d = this.data();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        let grey = d.data[p * 4] * 0.3 + d.data[p * 4 + 1] * 0.59 + d.data[p * 4 + 2] * 0.11;
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

WImage.addFilter(function reverseFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height } = {}) {
    let d = this.data();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        d.data[p * 4] = 255 - d.data[p * 4];
        d.data[p * 4 + 1] = 255 - d.data[p * 4 + 1];
        d.data[p * 4 + 2] = 255 - d.data[p * 4 + 2];
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});

WImage.addFilter(function blurFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height, degree = 1 } = {}) {
    let d = this.data();
    let tmpd = this.data();
    let {width, height} = this.canvas();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        let color = {
            r: 0, g: 0, b: 0,
        };
        for (let dx = -degree ; dx <= degree ; dx++) {
            for (let dy = -degree ; dy <= degree ; dy++) {
                let x = j + dx;
                let y = i + dy;
                if (x < 0 || y < 0) continue;
                if (x >= width || y >= height) continue;
                let p = WImage.indexWithXY(x, y, width);
                color.r += tmpd.data[p * 4];
                color.g += tmpd.data[p * 4 + 1];
                color.b += tmpd.data[p * 4 + 2];
            }
        }
        let rectSize = Math.pow(2 * degree + 1, 2);
        color.r /= rectSize;
        color.g /= rectSize;
        color.b /= rectSize;
        d.data[p * 4] = color.r;
        d.data[p * 4 + 1] = color.g;
        d.data[p * 4 + 2] = color.b;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function mosaicFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height, degree = 5 } = {}) {
    let d = this.data();
    let tmpd = this.data();
    let {width, height} = this.canvas();
    let ctx = this.canvas().getContext("2d");
    for (let i = y ; i < y + sh && i < height ; i += degree) {
        for (let j = x ; j < x + sw && j < width ; j += degree) {
            let p = i * width + j;
            let color = {
                r: 0, g: 0, b: 0,
            };
            if (i < 0 || j < 0) continue;
            if (i >= height || j >= width) continue;
            for (let dx = 0 ; dx < degree ; dx++) {
                for (let dy = 0 ; dy < degree ; dy++) {
                    let x = j + dx;
                    let y = i + dy;
                    if (dy < 0 || dx < 0) continue;
                    if (dy >= height || dx >= width) continue;
                    let p = WImage.indexWithXY(x, y, width);
                    color.r += tmpd.data[p * 4];
                    color.g += tmpd.data[p * 4 + 1];
                    color.b += tmpd.data[p * 4 + 2];
                }
            }
            let rectSize = Math.pow(degree, 2);
            color.r /= rectSize;
            color.g /= rectSize;
            color.b /= rectSize;
            for (let dx = 0 ; dx < degree ; dx++) {
                for (let dy = 0 ; dy < degree ; dy++) {
                    let x = j + dx;
                    let y = i + dy;
                    if (dy < 0 || dx < 0) continue;
                    if (dy >= height || dx >= width) continue;
                    let p = WImage.indexWithXY(x, y, width);
                    d.data[p * 4] = color.r;
                    d.data[p * 4 + 1] = color.g;
                    d.data[p * 4 + 2] = color.b;
                }
            }
        }
    }
    ctx.putImageData(d, 0, 0);
});

WImage.addFilter(function posterFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height } = {}) {
    let d = this.data();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        d.data[p * 4] = d.data[p * 4] & 0xe0;
        d.data[p * 4 + 1] = d.data[p * 4 + 1] & 0xe0;
        d.data[p * 4 + 2] = d.data[p * 4 + 2] & 0xe0;
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});
WImage.addFilter(function shieldFilter({ x = 0, y = 0, sw = this.canvas().width, sh = this.canvas().height, shields = [] } = {}) {
    let d = this.data();
    let ctx = this.canvas().getContext("2d");
    this.echo(function (j, i, p) {
        for (let a of shields) {
            d.data[p * 4 + a] = 0;
        }
    }, { x: x, y: y, sw: sw, sh: sh });
    ctx.putImageData(d, 0, 0);
});