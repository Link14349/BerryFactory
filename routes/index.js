var express = require('express');
var router = express.Router();
let connection = require("./mysql");

/* GET home page. */
router.get('/', function (req, res, next) {
    let start = 0;
    let end = 30;
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
            connection.query(`select * from users order by level desc limit 30`, [start, end], function (err, res3) {
                if (err) {
                    console.log(err);
                    res.render("link", {
                        message: "服务器错误!",
                        linkname: "首页",
                        url: "/"
                    });
                    return;
                }
                res.render("index", {
                    pictures: res1,
                    users: res3,
                    start: start, end: end,
                    last: last,
                });
            });
        });
    });
});

module.exports = router;
