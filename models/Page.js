var Page = function () {
    this.rows = []
    this.total = 1
    this.pageCount = 1
    this.pageSize = 10
    this.currentPage = 1
}

Page.prototype.setRows = function (rows) {
    this.rows = rows
}

Page.prototype.setTotal = function (total) {
    this.total = total
}

Page.prototype.setPageCount = function (pageCount) {
    this.pageCount = pageCount
}

Page.prototype.setPageSize = function (pageSize) {
    this.pageSize = pageSize
}

Page.prototype.setCurrentPage = function (currentPage) {
    this.currentPage = currentPage
}

module.exports = Page;