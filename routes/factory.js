var express = require('express');
var router = express.Router();
var connection = require("./mysql");

function factory(req, res, next) {
    res.render("factory");
}

/* GET home page. */
router.get('/', function (req, res, next) {
    let {name, pw} = req.cookies;
    // let name = "zyh";
    // let pw = "e10adc3949ba59abbe56e057f20f883e";
    // console.log(req.cookies);
    // console.log();
    // console.log(name, pw);
    if (name === undefined || pw === undefined) {
        res.render("link", {
            message: "请先登录或注册!",
            linkname: "登录页面",
            url: "/users/login"
        });
        return;
    }
    connection.query(`select * from users where name=? and pw=? limit 1`, [name, pw], function (err, res_) {
        if (err) {
            console.log(err);
            res.render("link", {
                message: "服务器错误!",
                linkname: "主页",
                url: "/"
            });
            return;
        }
        if (res_.length < 1) {
            res.render("link", {
                message: "用户名或密码错误!",
                linkname: "登录页面",
                url: "/users/login"
            });
            return;
        }
        factory(req, res, next);
    });
});

module.exports = router;
