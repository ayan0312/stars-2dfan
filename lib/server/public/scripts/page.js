$(document).ready(function () {
    function Page() {
        this.ul = $(`<ul></ul>`)
        this.currentPage = 0
        this.total = 0
        this.max = 9

        this.events = new window.Events()
    }

    Page.prototype = {
        create: function (num, page) {
            this.total = num
            this.currentPage = page
            this.change(this.currentPage)
            var div = $(`<div class="pages"></div>`)
            return div.append(this.ul)

        },
        li: function () {
            return $(`<li></li>`)
        },
        a: function (name) {
            return $(`<a href="javascript:;">${name}</a>`)
        },
        emptyPage: function () {
            var li = $('<li></li>')
            var span = $('<span>...</span>')
            return li.append(span)
        },
        change: function (num) {
            this.page = {
                first: this.firstPage(),
                last: this.lastPage(),
                firstEmpty: this.emptyPage(),
                lastEmpty: this.emptyPage(),
                prev: this.prevPage(),
                next: this.nextPage()
            }
            var middleMaxNum = Math.ceil(this.max / 2)
            this.changePage(num, (position, type) => {
                if (position === 'start') {
                    this.ul.append(this.page.first)
                    this.ul.append(this.page.prev)
                    this.ul.append(this.page.firstEmpty)
                }

                if (position === 'middle') {
                    if (type === 'first') {
                        for (var i = 1; i <= middleMaxNum; i++) {
                            var a = this.bindACommonEvents(this.a(i), i)
                            var li = this.bindEvents(this.li(), a)
                            if (i === this.currentPage) {
                                this._active(li)
                            }
                            this.ul.append(li)
                        }
                    }
                    if (type === 'last') {
                        for (var i = this.total - middleMaxNum + 1; i <= this.total; i++) {
                            var a = this.bindACommonEvents(this.a(i), i)
                            var li = this.bindEvents(this.li(), a)
                            if (i === this.currentPage) {
                                this._active(li)
                            }
                            this.ul.append(li)
                        }
                    }
                    if (type === 'all') {
                        var min = num - 4
                        min = min < 1 ? 1 : min
                        var max = num + 4
                        max = max > this.total ? this.total : max
                        for (var i = min; i <= max; i++) {
                            var a = this.bindACommonEvents(this.a(i), i)
                            var li = this.bindEvents(this.li(), a)
                            if (i === this.currentPage) {
                                this._active(li)
                            }
                            this.ul.append(li)
                        }
                    }
                }

                if (position === 'over') {
                    this.ul.append(this.page.lastEmpty)
                    this.ul.append(this.page.next)
                    this.ul.append(this.page.last)
                }
            })
        },
        bindEvents: function (li, a) {
            return li.append(a)
        },
        changePage: function (num, callback) {
            var middleMaxNum = Math.floor(this.max / 2)
            if (num <= 0) return false
            callback('start')
            if (num === 1) {
                callback('first')
                this._hide(this.page.first)
                this._hide(this.page.prev)
                this._hide(this.page.firstEmpty)
                callback('middle', 'first')
                if (this.total > middleMaxNum) {
                    callback('more')
                    this._show(this.page.lastEmpty)
                } else {
                    this._hide(this.page.lastEmpty)
                }
                callback('over')
                this._show(this.page.last)
                this._show(this.page.next)
                return
            }

            if (num === this.total) {
                callback('last')
                this._show(this.page.first)
                this._show(this.page.prev)
                callback('middle', 'last')
                if (this.total > middleMaxNum) {
                    callback('less')
                    this._show(this.page.firstEmpty)
                } else {
                    this._hide(this.page.firstEmpty)
                }
                callback('over')
                this._hide(this.page.lastEmpty)
                this._hide(this.page.last)
                this._hide(this.page.next)
                return
            }

            callback('all')
            this._show(this.page.first)
            this._show(this.page.prev)
            if (num <= middleMaxNum + 1) {
                callback('less')
                this._hide(this.page.firstEmpty)
            } else {
                this._show(this.page.firstEmpty)
            }
            callback('middle', 'all')
            if (num < this.total - middleMaxNum) {
                callback('more')
                this._show(this.page.lastEmpty)
            } else {
                this._hide(this.page.lastEmpty)
            }
            callback('over')
            this._show(this.page.last)
            this._show(this.page.next)
        },
        firstPage: function () {
            var li = this.li()
            var a = this.a('首页')
            li.append(a)
            this.bindACommonEvents(a, 1)
            return li
        },
        lastPage: function () {
            var li = this.li()
            var a = this.a('尾页')
            li.append(a)
            this.bindACommonEvents(a, this.total)
            return li
        },
        prevPage: function () {
            var li = this.li()
            var a = this.a('上一页')
            li.append(a)
            this.bindACommonEvents(a, this.currentPage - 1)
            return li
        },
        nextPage: function () {
            var li = this.li()
            var a = this.a('下一页')
            li.append(a)
            this.bindACommonEvents(a, this.currentPage + 1)
            return li
        },
        _active: function (li) {
            li.addClass('active')
        },
        _show: function (li) {

        },
        _hide: function (li) {
            li.remove()
        },
        bindACommonEvents: function (a, num) {
            a.bind('click', () => {
                if(this.currentPage === num) return
                this.currentPage = num
                this.events.trigger('current', num)
                this.ul.html('')
                this.change(this.currentPage)
            })
            return a
        },
        on: function (callback) {
            this.events.on('current', callback)
        }
    }

    window.Page = Page
})