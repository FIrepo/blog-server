/**
 * Created by Administrator on 2017/7/24.
 */
var express = require('express')
var router = express.Router()
var JsonResult = require('../models/JsonResult')
var Page = require('../models/Page')

// 保存文章
router.post('/save',function (req, res, next) {
    console.log(req.param('blog'))
})

module.exports = router
