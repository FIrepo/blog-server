var express = require('express');
var router = express.Router();
var Page = require('../models/Page')
var JsonResult = require('../models/JsonResult')
var User = require('../models/User')
var MD5 = require('md5')
var mongoose = require('mongoose')

/* GET users listing. */
router.post('/login', function (req, res, next) {
    var jsonResult = new JsonResult()
    var username = req.param('username');
    var password = req.param('password'); 

    User.findOne({ userName: username}, function (err, doc){
        if( doc ){
            if(MD5(password.substring(3,7)) === doc.password) {
                req.session.user = username
                jsonResult.setData({
                    username: doc.userName,
                    role: doc.role
                })
            } else {
                jsonResult.setStatue(1)
                jsonResult.setMessage('密码不正确！')
            }
        } else {
            jsonResult.setStatue(1)
            jsonResult.setMessage('用户名不存在')
        }
        res.json(jsonResult)
    });
});

router.post('/getUser', function (req, res, next) {

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

// 保存方法
router.post('/addItem',function (req, res, next) {
    var jsonResult = new JsonResult()
    var userItem = req.param('form')

    if (userItem['password'].length !== 32) {
        userItem['password'] = MD5(userItem['password'].substring(3,7))
    }

    console.log(req.param('_id'))
    if (req.param('_id')) {
        User.update({
            '_id': mongoose.Types.ObjectId(req.param('_id'))},
            {$set: userItem},
            function (err) {
                if (err) {
                    jsonResult.setStatue(1)
                    jsonResult.setMessage(err.message)
                }
                res.json(jsonResult)
            })
    } else {
        userItem['rTime'] = new Date()
        var user = new User(userItem)
        user.save(function (err) {
            if (err) {
                jsonResult.setStatue(1)
                switch (err.code){
                    case 11000:
                        jsonResult.setMessage(userItem.userName +' 用户名已存在！')
                        break
                    default:
                        jsonResult.setMessage(err)
                }
            }
            res.json(jsonResult)
        })
    }

})

// 删除方法
router.post('/deleteItem/:id',function(req,res,next){
    var jsonResult = new JsonResult()

   /* if (req.params.username === 'admin') {
        jsonResult.setStatue = 1
        jsonResult.setMessage = '超级管理员不能删除！'
        res.json(jsonResult)
    }*/

    User.remove({_id: mongoose.Types.ObjectId(req.params.id)}, function(err){
        if (err) {      
            jsonResult.setStatue = 1
            jsonResult.setMessage = err
        } 
        res.json(jsonResult)
    })


})

// 查询单条
router.post('/getOne/:id',function (req,res,next) {
    var jsonResult = new JsonResult()
    User.findOne({'_id': mongoose.Types.ObjectId(req.params.id)},function (err, doc) {
        if (err) {
            jsonResult.setStatue = 1
            jsonResult.setMessage = err
        }
        jsonResult.setData(doc)
        res.json(jsonResult)
    })
})

module.exports = router
