/**
 * Created by Administrator on 2017/7/6.
 */
var mongoose = require('mongoose')
var db = require('./db.js')
var async = require('async')
var Page = require('./Page.js')

var BlogSchema = mongoose.Schema({
    // 主标题
    "mainTitle": String,
    // 副标题
    "preTitle": String,
    // 所属分类
    "titleType": Array,
    // 查看权限 0: 自己可看,1: 所有人可看
    "authority": String,
    // 创建时间
    "cTime": Date,
    // 作者
    "author": String,
    // 内容
    "content": String,
    // 关键字
    "keyword": Array,
    // 状态 0: 发布,1: 草稿
    "statue": String

})

// 分页查询
BlogSchema.statics.queryByPage = function (page, cb) {
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
            Model.find(queryParams,{"content":0,}).skip(start).limit(pageSize).exec(function (err, rows) {
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