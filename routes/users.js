var express = require('express');
var router = express.Router();
var Page = require('../models/Page')
var JsonResult = require('../models/JsonResult')
var User = require('../models/User')

/* GET users listing. */
router.post('/login', function (req, res, next) {
    var username = req.param('username');
    var password = req.param('password');
    if (username === 'admin' && password === 'admin') {
        res.json({
            statue: 0,
            message: '登录成功',
            data: {
                username: '吴成凡'
            }
        })
    } else {
        res.json({
            statue: 1,
            message: '用户名或密码不正确！'
        })
    }
});

router.post('/getUser', function (req, res, next) {
    /*var user = new User({name: 'wcf',age: 25})
    user.save(function () {
        console.log('存储成功！')
    })*/

    var page = new Page()
    var jsonResult = new JsonResult()

    User.find(function (err, rows) {

        if (err) {
            jsonResult.setStatue(1)
            jsonResult.setMessage(err.message)
        }else{
            page.setRows(rows)
            page.setTotal(rows.length)
            jsonResult.setData(page)
        }

        res.json(jsonResult)
    })

})

router.post('/addItem',function (req, res, next) {
    var jsonResult = new JsonResult()

    var userItem = req.param('form')
    userItem['rTime'] = new Date()
    var user = new User(userItem)
    user.save(function (err) {
        if (err) {
            console.log(err.message)
            jsonResult.setStatue(1)
            jsonResult.setMessage(err.message)
        }
        res.json(jsonResult)
    })
})

module.exports = router
