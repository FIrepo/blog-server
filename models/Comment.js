/**
 * Created by Administrator on 2017/7/6.
 */
const mongoose = require('mongoose')
const db = require('./db.js')
const async = require('async')
const Page = require('./Page.js')

const CommentSchema = mongoose.Schema({
    // 评论内容
    "body": String,
    // 评论人
    "person": String,
    // 评论谁
    "byPerson": String,
    // 创建时间
    "cTime": Date,
    //  是否是作者
    "isAuthor": String,
    // 文章id
    "blogId": String
})

// 分页查询
CommentSchema.statics.queryById = function (id, page, cb) {
    let Model = this
    let pageSize = page.pageSize || 10
    let query = page.query
    let currentPage = page.currentPage || 1
    let start = (currentPage-1) * pageSize
    let pageResult = new Page()
    queryParams = {
        'blogId': id
        /*title: new RegExp(query.title),
        titleType: new RegExp(query.titleType),
        statue: new RegExp(query.statue),
        $and: query.rangeTime[0] ? [{cTime:{"$gt":query.rangeTime[0]}},{cTime:{"$lt":query.rangeTime[1]}}] : [{},{}]*/
    }
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

module.exports = db.model('Comment', CommentSchema)