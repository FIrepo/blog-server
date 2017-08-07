var express = require('express');
var router = express.Router();
var Blog = require('../models/Blog')
var BlogClass = require('../models/BlogClass')
var comment = require('../models/Comment')
var Page = require('../models/Page')

// 获取博客
router.get('/getBlogs', function(req, res, next) {
    Blog.find({
        statue: '0'
    },{"content": 0})
        .limit(req.param("pageSize")).exec(function (err, blogs) {
        res.json(blogs)
    });
});

// 获取博客依靠年分类
router.get('/getBlogsYear', function(req, res, next) {
    var result = {}
    console.log(req.param('titleType'))
    Blog.find({
        statue: '0',
        titleType: req.param('titleType') || new RegExp('')
    },{"content": 0, 'blogHtmlContent': 0}).exec(function (err, blogs) {

        for(var i in blogs) {
            var item = blogs[i+'']
            var year = new Date(item.cTime).getFullYear()+''
            if (result[year]) {
                result[year].push(item)
            } else {
                result[year] = [item]
            }
        }
        res.json(result)
    });
});

// 根据id查询文章
router.get('/getBlogById', function (req, res, next) {
    Blog.findById(req.param('id'),{"content": 0}, function (err, blog) {
        res.json(blog)
    })
})

// 获取分类
router.get('/getClass', function (req, res, next) {
    BlogClass.find(function (err, classes) {
        res.json(classes)
    })
})

// 保存评论
router.post('/comment/save', function (req, res, next) {
    console.log(123)
    Comment.create(req.param('commentForm'), function (err, comments) {
        console.log(err)
        console.log(comments)
    })
})

module.exports = router;
