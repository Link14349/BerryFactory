var express = require('express');
var router = express.Router();
var connection = require("./mysql");

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.cookie("name", "zyh");
    // res.cookie("pw", "e10adc3949ba59abbe56e057f20f883e");
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
        connection.query(`select * from pictures where author=? limit 30`, [res_[0].id], function (err, res2) {
            if (err) {
                console.log(err);
                res.render("link", {
                    message: "服务器错误!",
                    linkname: "主页",
                    url: "/"
                });
                return;
            }
            // console.log(res_);
            res.render("me", {
                user: res_[0],
                pictures: res2
            });
        });
    });
    // connection.query("select max(id) from users", function (err, res_) {
    //     console.log(res_[0]["max(id)"]);
    // });
});

module.exports = router;
