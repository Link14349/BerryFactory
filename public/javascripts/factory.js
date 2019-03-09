var pic_jq = $("#picture");
var upload_jq = $("#picture-loader");
var ctx = pic_jq[0].getContext("2d");
var textShower = $("#text-shower");
var penShower = $("#pen-shower");
var graffitiShower = $("#graffiti-shower");
var width = window.innerWidth / 2, height = window.innerHeight / 2;
var textX = null, textY = null;
var image = new WImage();
const maxSize = 2500;// 图片最大的长宽

image.bind(pic_jq[0]);
var type = "";
var textInfo = {
    family: "Arial",
    size: "20px",
    color: "#ffffff"
};
var penInfo = {
    size: 50,
    color: "#2aabd2",
    drawing: false
};
var graffitiInfo = {
    size: 50,
    style: "blur",// mosaic
    drawing: false
};

pic_jq.attr("width", width);
pic_jq.attr("height", height);
pic_jq.css({
    "left": window.innerWidth / 2 - width / 2 + "px"
});
upload_jq[0].onchange = function (e) {
    var reader = new FileReader();
    // console.log(upload_jq[0].files[0]);
    reader.readAsDataURL(upload_jq[0].files[0]);
    reader.onload = function (e) {
        // console.log(e.target.result);
        var img = new Image();
        // console.log(e.target.result);
        img.src = e.target.result;
        // console.log(img.src);
        img.onerror = function (e) {
            console.log(e);
        };
        img.onload = function (e) {
            width = img.width;
            height = img.height;
            if (Math.max(width, height) > maxSize) {
                let scale = maxSize / Math.max(width, height);
                width *= scale;
                height *= scale;
            }
            pic_jq.attr("width", width);
            pic_jq.attr("height", height);
            if (width >= window.innerWidth) {
                pic_jq.css({
                    "left": "0px"
                });

            } else {
                pic_jq.css({
                    "left": window.innerWidth / 2 - width / 2 + "px"
                });
            }
            ctx.drawImage(img, 0, 0, width, height);
        };
    }
};

function bar() {
    $("#font-controller").fadeOut(0);
    $("#pen-controller").fadeOut(0);
    $("#graffiti-controller").fadeOut(0);
    $("#filter-controller").fadeOut(0);
    switch (type) {
        case "text":
            updateText();
            pic_jq.css("cursor", "text");
            $("#font-controller").fadeIn(0);
            break;
        case "pen":
            pic_jq.css("cursor", "auto");
            $("#pen-controller").fadeIn(0);
            break;
        case "graffiti":
            pic_jq.css("cursor", "auto");
            $("#graffiti-controller").fadeIn(0);
            break;
        case "filter":
            pic_jq.css("cursor", "auto");
            $("#filter-controller").fadeIn(0);
            break;
    }
}

$("#text").click(function () {
    type = "text";
    bar();
});
$("#pen").click(function () {
    type = "pen";
    bar();
});
$("#graffiti").click(function () {
    type = "graffiti";
    bar();
});
$("#filter").click(function () {
    type = "filter";
    bar();
});

pic_jq.click(function (e) {
    switch (type) {
        case "text":
            $("#input-text").modal();
            textX = e.offsetX;
            textY = e.offsetY;
            break;
    }
});
pic_jq.mousedown(function () {
    if (type == "pen") penInfo.drawing = true;
    if (type == "graffiti") graffitiInfo.drawing = true;
});
pic_jq.mousemove(function (e) {
    if (type == "pen" && penInfo.drawing) {
        ctx.fillStyle = penInfo.color;
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, penInfo.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    if (type == "graffiti" && graffitiInfo.drawing) {
        console.log(graffitiInfo.style);
        image.filter(graffitiInfo.style, {
            x: parseInt(String(e.offsetX / graffitiInfo.size)) * graffitiInfo.size,
            y: parseInt(String(e.offsetY / graffitiInfo.size)) * graffitiInfo.size,
            sw: graffitiInfo.size,
            sh: graffitiInfo.size,
            degree: graffitiInfo.size,
        });
    }
});
pic_jq.mouseup(function () {
    if (type == "graffiti") graffitiInfo.drawing = false;
});

$("#add-text").click(function () {
    $("#input-text").modal("hide");
    var txt = $("#image-text").val();
    ctx.font = textInfo.size + " " + textInfo.family;
    ctx.fillStyle = textInfo.color;
    $("#image-text").val("");
    ctx.fillText(txt, textX, textY);
});

function updateText() {
    textShower.css({
        "font-size": textInfo.size,
        "font-family": textInfo.family,
        "color": textInfo.color,
    });
}
function updatePen() {
    penShower.css({
        "width": penInfo.size + "px",
        "height": penInfo.size + "px",
        "background-color": penInfo.color
    });
}
function updateGraffiti() {
    graffitiShower.css({
        "width": graffitiInfo.size + "px",
        "height": graffitiInfo.size + "px",
        "src": "/uploads/graffiti/" + graffitiInfo.style + ".png"
    });
}

$("#font-family").change(function (e) {
    textInfo.family = $(this).val();
    updateText();
});
$("#font-color").change(function (e) {
    textInfo.color = $(this).val();
    updateText();
});
$("#font-size").mousemove(function (e) {
    textInfo.size = $(this).val() + "px";
    updateText();
});
$("#pen-size").mousemove(function (e) {
    penInfo.size = $(this).val();
    updatePen();
});
$("#graffiti-size").mousemove(function (e) {
    graffitiInfo.size = $(this).val();
    updateGraffiti();
});
graffitiShower.click(function () {
    $("#input-graffiti").modal();
});
function graffitiStyle(s) {
    console.log(s);
    graffitiInfo.style = s;
}
$(".board").click(function () {
    type = "";
    bar();
});

$.extend({
    StandardPost: function(url,args){
        var form = $("<form method='post'></form>"),
            input;
        form.attr({"action":url});
        $.each(args,function(key,value){
            input = $("<input type='hidden'>");
            input.attr({"name":key});
            input.val(value);
            form.append(input);
        });
        // console.log(form);
        $("body:first").append(form);
        form.submit();
    }
});

function publish() {
    // setCookie("data", pic_jq[0].toDataURL(), 1);
    console.log(document.cookie);
    // window.location.href = "/publish/picture";
    // var form = $("<form method='post' action='/publish/picture'></form>");
    // var input = $("<input type='text'/>").val(pic_jq[0].toDataURL()).attr('name','bar');
    $.StandardPost("/publish/picture", {
        file: pic_jq[0].toDataURL(),
        width: width,
        height: height
    });
    // form.append(input);
    // form.submit();
    // $.ajax({
    //     method: "POST",
    //     data: {
    //         file: pic_jq[0].toDataURL()
    //     },
    //     url: "/publish/picture",
    //     error: function (e) {
    //         alert("图片过大，上传失败！");
    //         alert("错误信息: " + e);
    //     },
    //     success: function (data) {
    //         console.log(arguments);
    //     }
    // });
}

ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, width, height);

bar();