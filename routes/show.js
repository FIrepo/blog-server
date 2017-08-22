const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog')
const BlogClass = require('../models/BlogClass')
const Comment = require('../models/Comment')
const Page = require('../models/Page')
const JsonResult = require('../models/JsonResult')

// 获取博客
router.get('/getBlogs', function(req, res, next) {
    let keyword = req.param('keyword')
    console.log(keyword)
    Blog.find({
        statue: '0',
        $or: [
            {'title': {'$regex': keyword, $options: '$i'}},
            {'content': {'$regex': keyword, $options: '$i'}}
        ]
    },{"content": 0})
        .limit(req.param("pageSize")).exec(function (err, blogs) {
            if (!blogs) res.json(blogs)
            for(let i=0;i<blogs.length;i++){
                let item = blogs[i]
                if (!item) continue
                let reg = new RegExp("<[^<]*>", "gi")
                blogs[i].blogHtmlContent = item.blogHtmlContent.replace(reg, "")
            }
            res.json(blogs)
    })
})

// 获取博客依靠年分类
router.get('/getBlogsYear', function(req, res, next) {
    let result = {}
    console.log(req.param('titleType'))
    Blog.find({
        statue: '0',
        titleType: req.param('titleType') || new RegExp('')
    },{"content": 0, 'blogHtmlContent': 0}).exec(function (err, blogs) {

        for(let i in blogs) {
            let item = blogs[i+'']
            let year = new Date(item.cTime).getFullYear()+''
            if (result[year]) {
                result[year].push(item)
            } else {
                result[year] = [item]
            }
        }
        res.json(result)
    });
})

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
    let jsonResult = new JsonResult()
    let commentForm = req.param('commentForm')
    commentForm['cTime'] = new Date()
    Comment.create(commentForm, function (err, comments) {
        if (err) {
            jsonResult.setStatue(1)
        }
        res.json(jsonResult)
    })
})

// 获取评论
router.get('/comment/:id', function (req, res, next) {
    Comment.find({'blogId': req.params.id},function (err, comments) {
        res.json(comments)
    })
})

module.exports = router;
