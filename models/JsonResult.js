/**
 * Created by Administrator on 2017/7/5.
 */
var JsonResult = function () {
    this.statue = 0
    this.data = {}
    this.message = ''
}

JsonResult.prototype.setStatue = function (statue) {
    this.statue = statue
}

JsonResult.prototype.setMessage = function (message) {
    this.message = message
}

JsonResult.prototype.setData = function (data) {
    this.data = data
}

module.exports = JsonResult;