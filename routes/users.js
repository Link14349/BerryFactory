var express = require('express');
var router = express.Router();
let connection = require("./mysql");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get('/login', function (req, res, next) {
    res.render("login");
});
router.get('/login-submit', function (req, res, next) {
    let {name, pw} = req.query;
    connection.query(`select * from users where name=? and pw=? limit 1`, [name, pw], function (err, res_) {
        // console.log(res_);
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
        res.cookie("name", name);
        res.cookie("pw", pw);
        res.render("link", {
            message: "登录成功!!",
            linkname: "主页",
            url: "/"
        });
    });
});
router.get('/sign-up', function (req, res, next) {
    res.render("sign-up");
});
router.get('/sign-up-submit', function (req, res, next) {
    let {name, pw1, pw2} = req.query;
    if (pw1 != pw2) {
        res.render("link", {
            message: "密码确认失败!",
            linkname: "注册页面",
            url: "/users/sign-up"
        });
        return;
    }
    let pw = pw1;
    connection.query(`select * from users where name=? limit 1`, [name], function (err, res_) {
        // console.log(res_);
        if (err) {
            console.log(err);
            res.render("link", {
                message: "服务器错误!",
                linkname: "主页",
                url: "/"
            });
            return;
        }
        if (res_.length > 0) {
            res.render("link", {
                message: "已有该用户名请换一个!",
                linkname: "注册页面",
                url: "/users/sign-up"
            });
            return;
        }
        connection.query(`insert users values (NULL, ?, ?, 0)`, [name, pw], function (err, res_) {
            if (err) {
                console.log(err);
                res.render("link", {
                    message: "服务器错误!",
                    linkname: "主页",
                    url: "/"
                });
                return;
            }
            res.render("link", {
                message: "注册成功!",
                linkname: "登录页面",
                url: "/users/login"
            });
        });
    });
});

router.get('/user', function (req, res, next) {
    // res.cookie("name", "zyh");
    // res.cookie("pw", "e10adc3949ba59abbe56e057f20f883e");
    let {id} = req.query;
    // let name = "zyh";
    // let pw = "e10adc3949ba59abbe56e057f20f883e";
    // console.log(req.cookies);
    // console.log();
    // console.log(name, pw);
    connection.query(`select * from users where id=? limit 1`, [id], function (err, res1) {
        if (err) {
            console.log(err);
            res.render("link", {
                message: "服务器错误!",
                linkname: "主页",
                url: "/"
            });
            return;
        }
        connection.query(`select * from pictures where author=? limit 30`, [id], function (err, res2) {
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
                user: res1[0],
                pictures: res2
            });
        });
    });
    // connection.query("select max(id) from users", function (err, res_) {
    //     console.log(res_[0]["max(id)"]);
    // });
});
router.get("/exit", function (req, res, next) {
    res.cookie("name", "", { expires: new Date(0) });
    res.cookie("pw", "", { expires: new Date(0) });
    res.render("link", {
        message: "退出登录成功!",
        linkname: "主页",
        url: "/"
    });
});



module.exports = router;
