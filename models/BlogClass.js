/**
 * Created by Administrator on 2017/7/6.
 */
var mongoose = require('mongoose')
var db = require('./db.js')
var async = require('async')
var Page = require('./Page.js')
var Blog = require('./Blog')

var BlogClassSchema = mongoose.Schema({
    // 文章名
    "blogClassName": {type:String, unique:true},
    // 已发布数量
    "blogCount_0": Number,
    // 草稿数量
    "blogCount_1": Number
})

// 分页查询
BlogClassSchema.statics.queryByPage = function (page, cb) {
    var Model = this
    var pageSize = page.pageSize || 10
    var query = page.query
    var currentPage = page.currentPage || 1
    var start = (currentPage-1) * pageSize
    var pageResult = new Page()
    queryParams = {
        /*username: new RegExp(query.username),
        $and: query.rangeTime[0] ? [{time:{"$gt":query.rangeTime[0]}},{time:{"$lt":query.rangeTime[1]}}] : [{},{}]*/
    }
    async.parallel({
        total: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, total) {
                done(err, total);
            })
        },
        rows: function (done) {   // 查询一页的记录
            Model.find(queryParams,{"content":0}).skip(start).limit(pageSize).exec(function (err, rows) {
                done(err, rows);
            });
        }
    },function (err, result) {
        pageResult.setRows(result.rows)
        pageResult.setTotal(result.total)
        pageResult.setPageCount(Math.ceil(result.total / pageSize))
        pageResult.setCurrentPage(currentPage)
        cb(err,pageResult)
    })
}

// 操作文章时引起的分类数量的变更
BlogClassSchema.statics.setBlogCount = function (className, cb) {
    async.parallel({
        blogCount_0: function (done) {
            Blog.count({titleType: className, statue: '0'},function (err, count) {
                done(err,count)
            })
        },
        blogCount_1: function (done) {
            Blog.count({titleType: className, statue: '1'},function (err, count) {
                done(err,count)
            })
        }
    },function (err, result) {
        if (err) {
            cb(err)
        } else {
            this.update({blogClassName: className},{$set:{blogCount_0:result.blogCount_0,blogCount_1:result.blogCount_1}},function (err) {
                cb(err)
            })
        }
    })
}

module.exports = db.model('BlogClass', BlogClassSchema)