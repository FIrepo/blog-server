/**
 * Created by Administrator on 2017/7/6.
 */
var mongoose = require('mongoose')
var db = require('./db.js')
var async = require('async')
var Page = require('./Page.js')

var BlogSchema = mongoose.Schema({
    // 文章名
    "title": String,
    // 所属分类
    "titleType": String,
    // 简述
    "abstract": String,
    // 创建时间
    "cTime": Date,
    // 作者
    "author": String,
    // 内容
    "content": String,
    // 关键字
    "keyword": Array,
    // 状态 0: 发布,1: 草稿
    "statue": String,
    // 评论
    "commentNumber": Number
})

// 分页查询
BlogSchema.statics.queryByPage = function (page, cb) {
    var Model = this
    var pageSize = page.pageSize || 10
    var query = page.query
    var currentPage = page.currentPage || 1
    var start = (currentPage-1) * pageSize
    var pageResult = new Page()
    queryParams = query ? {
        title: new RegExp(query.title),
        titleType: new RegExp(query.titleType),
        statue: new RegExp(query.statue),
        $and: query.rangeTime[0] ? [{cTime:{"$gt":query.rangeTime[0]}},{cTime:{"$lt":query.rangeTime[1]}}] : [{},{}]
    } : {}
    async.parallel({
        total: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, total) {
                done(err, total);
            })
        },
        rows: function (done) {   // 查询一页的记录
            Model.find(queryParams,{"content": 0, 'comment': 0}).skip(start).limit(pageSize).exec(function (err, rows) {
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

module.exports = db.model('Blog', BlogSchema)