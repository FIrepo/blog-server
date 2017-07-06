/**
 * Created by Administrator on 2017/7/6.
 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/blog');


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("数据库成功连接")
});

module.exports = db