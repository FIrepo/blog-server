/**
 * Created by Administrator on 2017/7/6.
 */
let mongoose = require('mongoose')
let db = require('./db.js')
let async = require('async')
let Page = require('./Page.js')
let Blog = require('./Blog')

let BlogClassSchema = mongoose.Schema({
    // 文章名
    "blogClassName": {type:String, unique:true},
    // 已发布数量
    "blogCount_0": Number,
    // 草稿数量
    "blogCount_1": Number
})

// 分页查询
BlogClassSchema.statics.queryByPage = function (page, cb) {
    let Model = this
    let pageSize = page.pageSize || 10
    let query = page.query
    let currentPage = page.currentPage || 1
    let start = (currentPage-1) * pageSize
    let pageResult = new Page()
    queryParams = {}
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
    let Model = this
    Model.find({},{"blogClassName":1,"_id":0},function (err, classes) {
        let querys = []
        classes.forEach(function (item) {
            querys.push(
                new Promise(function(resolve, reject) {
                    async.parallel({
                        blogCount_0: function (done) {
                            Blog.count({titleType: item.blogClassName, statue: '0'},function (err, count) {
                                done(err,count)
                            })
                        },
                        blogCount_1: function (done) {
                            Blog.count({titleType: item.blogClassName, statue: '1'},function (err, count) {
                                done(err,count)
                            })
                        }
                    },function (err, result) {
                        if (err) {
                            reject(err)
                        } else {
                            Model.update({blogClassName: item.blogClassName},{$set:{blogCount_0:result.blogCount_0,blogCount_1:result.blogCount_1}},function (err) {
                                if (err) reject(err)
                                resolve(err)
                            })
                        }
                    })
                })
            )
        })
        Promise.all(querys).catch((err) => {
            cb(err)
        })
    })
}

module.exports = db.model('BlogClass', BlogClassSchema)