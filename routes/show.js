var express = require('express');
var router = express.Router();
var Blog = require('../models/Blog')
var BlogClass = require('../models/BlogClass')
var Page = require('../models/Page')

// 获取博客分类
router.get('/getBlogs', function(req, res, next) {
    var page = new Page()
    page.setPageSize(req.param('pageSize'))
    Blog.queryByPage(page, function (err, blogs) {
        res.json(blogs)
    })
});

// 获取分类
router.get('/getClass', function (req, res, next) {
    BlogClass.find(function (err, classes) {
        res.json(classes)
    })
})

module.exports = router;
