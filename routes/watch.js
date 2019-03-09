var express = require('express');
var router = express.Router();
var connection = require("./mysql");
var fs = require("fs");

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.send("Hello world!");
    let start = req.query.s;
    let end = req.query.end;
    if (start === undefined) start = 0;
    if (end === undefined) end = 30;
    connection.query(`select * from pictures limit ?,?`, [start, end], function (err, res1) {
        if (err) {
            console.log(err);
            res.render("link", {
                message: "服务器错误!",
                linkname: "首页",
                url: "/"
            });
            return;
        }
        connection.query(`select max(id) from pictures`, [start, end], function (err, res2) {
            if (err) {
                console.log(err);
                res.render("link", {
                    message: "服务器错误!",
                    linkname: "首页",
                    url: "/"
                });
                return;
            }
            let last = res2[0]["max(id)"];
            res.render("watch", {
                pictures: res1,
                start: start, end: end,
                last: last,
            });
        });
    });
});

router.get("/picture", function (req, res, next) {
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
        let id = req.query.id;
        connection.query(`select * from pictures where id=? limit 1`, [id], function (err, res_) {
            if (err) {
                console.log(err);
                res.render("link", {
                    message: "服务器错误!",
                    linkname: "首页",
                    url: "/"
                });
                return;
            }
            if (res_.length < 1) {
                res.render("link", {
                    message: "没有找到该图片!",
                    linkname: "首页",
                    url: "/"
                });
                return;
            }
            let {id, title, desr, path, author} = res_[0];
            let data = fs.readFileSync(path);
            connection.query(`select * from users where id=? limit 1`, [author], function (err, res_) {
                if (err) {
                    console.log(err);
                    res.render("link", {
                        message: "服务器错误!",
                        linkname: "首页",
                        url: "/"
                    });
                    return;
                }
                connection.query(`select * from comments where picture=? order by good desc`, [id], function (err, res__) {
                    if (err) {
                        console.log(err);
                        res.render("link", {
                            message: "服务器错误!",
                            linkname: "首页",
                            url: "/"
                        });
                        return;
                    }
                    res.render("picture", {
                        id: id,
                        title: title,
                        desr: desr,
                        data: data,
                        author_id: res_[0].id,
                        author_name: res_[0].name,
                        author_level: res_[0].level,
                        comments: res__
                    });
                });
            });
        });
    });
});

module.exports = router;
