/**
 * Created by Administrator on 2017/7/24.
 */
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Blog = require('../models/Blog')
var BlogClass = require('../models/BlogClass')
var Log = require('../models/Log')
var Comment = require('../models/Comment')
var JsonResult = require('../models/JsonResult')
var Page = require('../models/Page')

// 分页查询
router.all('/getBlogs', function (req, res, next) {
    var jsonResult = new JsonResult()
    Blog.queryByPage(req.param('page'),function (err,logs) {
        if (err) {
            jsonResult.setStatue(1)
            jsonResult.setMessage(err.message)
        }
        jsonResult.setData(logs)
        res.json(jsonResult)
    })
})

// 保存文章
router.post('/save',function (req, res, next) {
    var jsonResult = new JsonResult()
    var blog = req.param('blog')
    blog['cTime'] = new Date()
    if (blog._id) {
        //  修改
        Blog.update({'_id': mongoose.Types.ObjectId(blog._id)},
            {$set: blog},
            function (err) {
                if (err) {
                    jsonResult.setStatue(1)
                    jsonResult.setMessage(err.message)
                } else {
                    BlogClass.setBlogCount(blog.titleType, function (err) {
                        if (err) {
                            jsonResult.setStatue(1)
                            jsonResult.setMessage(err.message)
                        }
                    })
                }
                Log.createOneLog(req, req.session.user + '更新了题目为【' + blog.title + '】的文章')
                res.json(jsonResult)
            })
    } else {
        // 新增到数据库
        delete blog._id
        blog['commentNumber'] = 0
        Blog.create(blog, function (err) {
            if (err) {
                jsonResult.setStatue(1)
                jsonResult.setMessage(err.message)
            } else {
                BlogClass.setBlogCount(blog.titleType, function (err) {
                    if (err) {
                        jsonResult.setStatue(1)
                        jsonResult.setMessage(err.message)
                    }
                })
                Log.createOneLog(req, req.session.user+'新增了题目为【'+blog.title+'】的文章')
            }
            res.json(jsonResult)
        })
    }
})

// 根据id获得一条数据
router.post('/getBlog', function (req, res, next) {
    var jsonResult = new JsonResult()
    Blog.findById(req.param('id'), function (err, blog) {
        if (err) {
            jsonResult.setStatue(1)
        } else {
            jsonResult.setData(blog)
        }
        res.json(jsonResult)
    })
})

// 删除一个
router.post('/deleteItem/:id/:className',function (req, res, next) {
    var jsonResult = new JsonResult()

    Blog.remove({_id: mongoose.Types.ObjectId(req.params.id)}, function (err) {
        if (err) {
            jsonResult.setStatue = 1
            jsonResult.setMessage = err
        } else {
            BlogClass.setBlogCount(req.params.className, function(err){
                if (err) {
                    jsonResult.setStatue(1)
                    jsonResult.setMessage(err.message)
                }
            })
        }
        res.json(jsonResult)
    })
})

// 设置状态
router.post('/setBlogStatue', function (req, res, next) {
    var jsonResult = new JsonResult()
    Blog.update({'_id':mongoose.Types.ObjectId(req.param('id'))},{$set:{statue: req.param('statueType')}},function (err, blog) {
        if (err) {
            jsonResult.setStatue(1)
            jsonResult.setMessage(err.message)
        } else {
            BlogClass.setBlogCount(req.param('className'),function (err) {
                if (err) {
                    jsonResult.setStatue(1)
                    jsonResult.setMessage(err.message)
                }
            })
        }
        res.json(jsonResult)
    })
})

// 新增一条分类
router.post('/addBlogClass',function (req, res, next) {
    var jsonResult = new JsonResult()
    BlogClass.create({
        blogClassName:req.param('blogClassName'),
        blogCount_0: 0,
        blogCount_1: 0
    },function (err) {
        if (err) {
            jsonResult.setStatue(1)
            if ( err.code === 11000) {
                jsonResult.setMessage('分类名已存在!')
            } else {
                jsonResult.setMessage(err.message)
            }
        }
        res.json(jsonResult)
    })
})

// 修改文章分类
router.post('/editBlogClass',function (req, res, next) {
    var jsonResult = new JsonResult()
    BlogClass.update({blogClassName: req.param('oldClassName')}, {$set: {blogClassName: req.param('newClassName')}}, function (err, doc) {
        if (err) {
            jsonResult.setStatue(1)
            jsonResult.setMessage(err.message)
            res.json(jsonResult)
        } else {
            Blog.update({titleType: req.param('oldClassName')}, {$set: {titleType: req.param('newClassName')}}, function (err, doc) {
                if (err) {
                    jsonResult.setStatue(1)
                    jsonResult.setMessage(err.message)
                }
                res.json(jsonResult)
            })

        }

    })
})

// 查询所有分类
router.post('/getBlogClass', function (req, res, next) {
    var jsonResult = new JsonResult()
    BlogClass.find(function (err, blogs) {
        if (err) {
            jsonResult.setStatue(1)
            jsonResult.setMessage(err.data)
        } else {
            jsonResult.setData(blogs)
        }
        res.json(jsonResult)
    })
})

// 删除分类
router.post('/deleteBlogClass/:id', function (req, res, next) {
    var jsonResult = new JsonResult()
    BlogClass.remove({'_id': mongoose.Types.ObjectId(req.params.id)}, function (err) {
        if (err) {
            jsonResult.setMessage(1)
            jsonResult.setStatue(err.message)
        }
        res.json(jsonResult)
    })
})

// 根据id获取评论
router.post('/getComment/:id', function (req, res, next) {
    var jsonResult = new JsonResult()
    Comment.queryById(req.params.id, req.param('page'),function (err, comments) {
        if (err) {
            jsonResult.setMessage('1')
            jsonResult.setMessage(err.message)
        } else {
            res.json(jsonResult)
        }

    })
})

module.exports = router
