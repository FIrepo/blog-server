/**
 * Created by Administrator on 2017/7/6.
 */
var mongoose = require('mongoose')
var db = require('./db.js')

var UserSchema = mongoose.Schema({
    "userName": {type:String, unique:true},
    "password": String,
    "gender": String,
    "tel": Number,
    "role": String,
    "rTime": Date,
    "remark": String
})

var User = db.model('User', UserSchema)

module.exports = User;