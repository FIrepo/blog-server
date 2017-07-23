var express = require('express')
var router = express.Router()
var Log = require('../models/Log')
var JsonResult = require('../models/JsonResult')
var Page = require('../models/Page')

// 查询所有日志
router.all('/getLogs', function (req, res, next) {
    var jsonResult = new JsonResult()
    Log.queryByPage(req.param('page'),function (err,logs) {
        if (err) {
            jsonResult.setStatue(1)
            jsonResult.setMessage(err.message)
        }
        jsonResult.setData(logs)
        res.json(jsonResult)
    })
})

module.exports = router;
