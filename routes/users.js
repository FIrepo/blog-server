const express = require('express');
const router = express.Router();
const Page = require('../models/Page')
const JsonResult = require('../models/JsonResult')
const User = require('../models/User')
const MD5 = require('md5')
const mongoose = require('mongoose')
const Log = require('../models/Log')

// 登录
router.post('/login', function (req, res, next) {
    let jsonResult = new JsonResult()
    let username = req.param('username');
    let password = req.param('password');
    User.findOne({userName: username}, function (err, doc) {
        if (doc) {
            if (MD5(password.substring(3, 7)) === doc.password) {
                req.session.user = username
                jsonResult.setData({
                    username: doc.userName,
                    role: doc.role
                })
                Log.createOneLog(req, username + '登录成功')
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

// 登出
router.post('/loginOut', function (req, res, next) {
    let jsonResult = new JsonResult()
    Log.createOneLog(req, req.session.user + '登出', function (err) {
        req.session.user = false
        res.json(jsonResult)
    })

})

// 重置密码
router.post('/resetPassword', function (req, res, next) {
    let jsonResult = new JsonResult()
    let id = req.param('id')
    let changedName = req.param('changedName')
    let password = MD5(req.param('password').substring(3, 7))
    User.findOne({'userName': req.session.user}, function (err, doc) {
        console.log(doc)
        if (doc.password === password) {

            if (doc.role !== '0') {
                jsonResult.setStatue(1)
                jsonResult.setMessage('您没有权限！')
            } else {
                User.update(
                    {'_id': mongoose.Types.ObjectId(id)},
                    {$set: {'password': MD5('000000'.substring(3, 7))}}
                    , function (err) {
                        if (err) {
                            sonResult.setStatue(1)
                            jsonResult.setMessage(err.message)
                        } else {
                            Log.createOneLog(req, req.session.user + '重置了' + changedName + '的密码！')
                        }
                    })
            }
        } else {
            jsonResult.setStatue(1)
            jsonResult.setMessage('密码不正确！')
        }
        res.json(jsonResult)
    })

})

//  根据token获取用户信息
router.post('/getUserByToken', function (req, res, next) {
    let jsonResult = new JsonResult()
    let token = req.cookies['Admin-Token']
    if (token) {
        User.findOne({'userName': token}, function (err, user) {
            if (err) {
                jsonResult.setStatue = 1
                jsonResult.setMessage = err.message
            } else {
                jsonResult.setData({
                    username: user.userName,
                    role: user.role
                })
            }
            res.json(jsonResult)
        })

    } else {
        res.json({
            statue: 5
        })
    }
})

// 获取列表
router.post('/getUser', function (req, res, next) {
    let page = new Page()
    let jsonResult = new JsonResult()

    User.queryByPage(req.param('page'), function (err, users) {
        if (err) {
            jsonResult.setStatue(1)
            jsonResult.setMessage(err.message)
        }
        jsonResult.setData(users)
        res.json(jsonResult)
    })
})

// 保存方法
router.post('/addItem', function (req, res, next) {
    let jsonResult = new JsonResult()
    let userItem = req.param('form')

    if (userItem['password'].length !== 32) {
        userItem['password'] = MD5(userItem['password'].substring(3, 7))
    }

    if (req.param('_id')) {
        User.update({'_id': mongoose.Types.ObjectId(req.param('_id'))},
            {$set: userItem},
            function (err) {
                if (err) {
                    jsonResult.setStatue(1)
                    jsonResult.setMessage(err.message)
                }
                Log.createOneLog(req, req.session.user + '更新了' + userItem.userName + '用户信息')
                res.json(jsonResult)
            })
    } else {
        userItem['rTime'] = new Date()
        let user = new User(userItem)
        user.save(function (err) {
            if (err) {
                jsonResult.setStatue(1)
                switch (err.code) {
                    case 11000:
                        jsonResult.setMessage(userItem.userName + ' 用户名已存在！')
                        break
                    default:
                        jsonResult.setMessage(err)
                }
            } else {
                Log.createOneLog(req, req.session.user + '新增了' + userItem.userName + '用户')
            }
            res.json(jsonResult)
        })
    }

})

// 删除方法
router.post('/deleteItem/:id', function (req, res, next) {
    let jsonResult = new JsonResult()

    /* if (req.params.username === 'admin') {
     jsonResult.setStatue = 1
     jsonResult.setMessage = '超级管理员不能删除！'
     res.json(jsonResult)
     }*/

    User.remove({_id: mongoose.Types.ObjectId(req.params.id)}, function (err) {
        if (err) {
            jsonResult.setStatue = 1
            jsonResult.setMessage = err
        }
        res.json(jsonResult)
    })
})

// 查询单条
router.post('/getOne/:id', function (req, res, next) {
    let jsonResult = new JsonResult()
    User.findOne({'_id': mongoose.Types.ObjectId(req.params.id)}, function (err, doc) {
        if (err) {
            jsonResult.setStatue = 1
            jsonResult.setMessage = err
        }
        jsonResult.setData(doc)
        res.json(jsonResult)
    })
})


module.exports = router
