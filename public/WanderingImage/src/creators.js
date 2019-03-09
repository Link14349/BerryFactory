WImage.addCreator(function fillCreator({x = 0, y = 0, width, height, color} = {}) {
    let {width: cw, height: ch} = this.canvas();
    width = width || cw;
    height = height || ch;
    let ctx = this.ctx();
    let d = ctx.createImageData(cw, ch);
    for (let i = y ; i < y + height && i < ch ; i++) {
        for (let j = x ; j < x + width && j < cw ; j++) {
            let p = i * cw + j;
            d.data[p * 4] = color.r;
            d.data[p * 4 + 1] = color.g;
            d.data[p * 4 + 2] = color.b;
            d.data[p * 4 + 3] = color.a;
        }
    }
    ctx.putImageData(d, 0, 0);
});
WImage.addCreator(function copyCreator({x = 0, y = 0, width, height, image} = {}) {
    let {width: cw, height: ch} = this.canvas();
    width = width || cw;
    height = height || ch;
    let ctx = this.ctx();
    let d = ctx.createImageData(cw, ch);
    for (let i = y ; i < y + height && i < ch ; i++) {
        for (let j = x ; j < x + width && j < cw ; j++) {
            let p = i * cw + j;
            d.data[p * 4] = image[p * 4 + 0];
            d.data[p * 4 + 1] = image[p * 4 + 1];
            d.data[p * 4 + 2] = image[p * 4 + 2];
            d.data[p * 4 + 3] = image[p * 4 + 3];
        }
    }
    ctx.putImageData(d, 0, 0);
});
WImage.addCreator(function mathCreator({x = 0, y = 0, width, height, math} = {}) {
    let {width: cw, height: ch} = this.canvas();
    width = width || cw;
    height = height || ch;
    let ctx = this.ctx();
    let d = ctx.createImageData(cw, ch);
    for (let i = y ; i < y + height && i < ch ; i++) {
        for (let j = x ; j < x + width && j < cw ; j++) {
            let p = i * cw + j;
            d.data[p * 4] = math.r(j, i);
            d.data[p * 4 + 1] = math.g(j, i);
            d.data[p * 4 + 2] = math.b(j, i);
            d.data[p * 4 + 3] = math.a(j, i);
        }
    }
    ctx.putImageData(d, 0, 0);
});