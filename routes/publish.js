var express = require('express');
var router = express.Router();
var connection = require("./mysql");
let path = require("path");
let fs = require("fs");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send("error.");
});

router.post('/picture', function (req, res, next) {
    let {name, pw} = req.cookies;
    let data = req.body.file;
    let {width, height} = req.body;
    if (data === undefined) {
        res.send("error");
        return;
    }
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
        res.render("publish-picture", {
            data: data,
            width: width, height: height
        });
    });
});
router.post('/picture', function (req, res, next) {
    let {name, pw} = req.cookies;
    let data = req.body.file;
    let {width, height} = req.body;
    if (data === undefined) {
        res.send("error");
        return;
    }
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
        res.render("publish-picture", {
            data: data,
            width: width, height: height
        });
    });
});
router.post("/comment", function (req, res, next) {
    let {name, pw} = req.cookies;
    let pictureid = req.body.picture, comment = req.body.comment;
    if (name === undefined || pw === undefined) {
        res.send("error未登录");
        return;
    }
    connection.query(`select * from users where name=? and pw=? limit 1`, [name, pw], function (err, res1) {
        if (err) {
            console.log(err);
            res.send("error服务器错误");
            return;
        }
        if (res1.length < 1) {
            res.send("error用户名或密码错误");
            return;
        }
        let userid = res1[0].id;
        connection.query(`select * from pictures where id=? limit 1`, [pictureid], function (err, res2) {
            if (err) {
                console.log(err);
                res.send("error服务器错误");
                return;
            }
            if (res2.length < 1) {
                res.send("error没有该图文");
                return;
            }
            let buffer = new Buffer(comment);
            comment = buffer.toString("base64");
            connection.query(`insert into comments values (NULL, ?, ?, ?, 0)`, [Number(pictureid), comment, userid], function (err, res2) {
                if (err) {
                    console.log(err);
                    res.send("error服务器错误");
                    return;
                }
                res.send("完成");
            });
        });
    });
});

router.post('/picture/submit', function (req, res, next) {
    let {name, pw} = req.cookies;
    let data = req.body.file;
    let {title, desc, width, height} = req.body;
    if (data === undefined) {
        res.send("error数据丢失");
        return;
    }
    // let name = "zyh";
    // let pw = "e10adc3949ba59abbe56e057f20f883e";
    // console.log(req.cookies);
    // console.log();
    // console.log(name, pw);
    if (name === undefined || pw === undefined) {
        res.send("error未登录");
        return;
    }
    connection.query(`select * from users where name=? and pw=? limit 1`, [name, pw], function (err, res_) {
        if (err) {
            console.log(err);
            res.send("error服务器错误");
            return;
        }
        if (res_.length < 1) {
            res.send("error用户名或密码错误");
            return;
        }
        let timestamp = Date.now();
        let filename = res_[0].id + "-" + timestamp + ".txt";
        let filepath = path.join(__dirname, "..", "public", "uploads", "users", filename);
        fs.writeFileSync(filepath, data);
        // res.send(path.join(__dirname, "..", "public", "uploads", "users", filename));
        // console.log(filepath);
        connection.query(`insert into pictures values (NULL, ?, ?, ?, ?)`, [title, desc, filepath, res_[0].id], function (err, res_) {
            if (err) {
                console.log(err);
                res.send("error服务器错误");
                return;
            }
            console.log("flag");
            connection.query(`select max(id) from pictures`, function (err, res_) {
                if (err) {
                    console.log(err);
                    res.send("error服务器错误");
                    return;
                }
                console.log("flag", res_);
                // console.log(res_);
                res.send(String(res_[0]["max(id)"]));
                console.log("flag", res_);
            });
        });
    });
});

router.get("/good", function (req, res, next) {
    let {name, pw} = req.cookies;
    let comment = req.query.comment;
    // let name = "zyh";
    // let pw = "e10adc3949ba59abbe56e057f20f883e";
    // console.log(req.cookies);
    // console.log();
    // console.log(name, pw);
    if (name === undefined || pw === undefined) {
        res.send("error请先登录或注册");
        return;
    }
    connection.query(`select * from users where name=? and pw=? limit 1`, [name, pw], function (err, res1) {
        if (err) {
            console.log(err);
            res.send("error服务器错误");
            return;
        }
        if (res1.length < 1) {
            res.send("error用户名或密码错误");
            return;
        }
        let id = res1[0].id;
        console.log(`select * from good where user=${id} and comment=${Number(comment)} limit 1`);
        connection.query(`select * from good where user=? and comment=? limit 1`, [id, Number(comment)], function (err, res2) {
            if (err) {
                console.log(err);
                res.send("error服务器错误");
                return;
            }
            if (res2.length > 0) {
                res.send("warning已点赞");
                return;
            }
            connection.query(`update comments set good=good+1 where id=?`, [comment], function (err, res3) {
                if (err) {
                    console.log(err);
                    res.send("error服务器错误");
                    return;
                }
                connection.query(`insert into good values (NULL, ?, ?)`, [Number(id), Number(comment)], function (err, res4) {
                    if (err) {
                        console.log(err);
                        res.send("error服务器错误");
                        return;
                    }
                    res.send("点赞成功");
                });
            });
        });
    });
});

module.exports = router;
