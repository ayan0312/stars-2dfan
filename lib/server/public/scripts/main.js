$(document).ready(function () {
    var windowTitle = window.WindowTitle.getInstance()

    window.mainArticle = function (page, callback) {
        var callback = callback || function () { }
        var article = $('<article class="content">正在加载中...</article>')
        callback(page, article)
        return article
    }

    window.mainPages = function (options, callback) {
        var pages = new window.Page()
        var article = options.article
        pages.on(function (clickpage) {
            var newArticle = window.mainArticle(clickpage, options.callback)
            article.replaceWith(newArticle)
            windowTitle.changeTitleName(options.title, `游戏列表_${clickpage}`)
            article = newArticle
        })
        var callback = callback || function () { }
        callback(article, pages)
    }

    window.pushWindowTitle = function (name, block) {
        var title = windowTitle.createWindowTitle($('.window-titles'), {
            name,
            block
        })
        return title
    }

    function getSubjectsMiddleware(page, article) {
        window.getSubjects(page, function (results) {
            article.text('')
            window.setCardData(results, article, true)
        })
    }

    window.createMain = function (currentPage, callback) {
        var callback = callback || getSubjectsMiddleware
        var article = window.mainArticle(currentPage, callback)
        var title = pushWindowTitle(`游戏列表_${currentPage}`, article)
        mainPages({
            title,
            article,
            callback
        }, function (element, pages) {
            window.getAllpage(function (results) {
                var data = results.data
                var page = Math.ceil(data.count / data.num)
                element.before(pages.create(page, currentPage))
            })
        })
        $('main').append(title.block)
    }

    window.createMain(getQueryVariable('page') || 1)
})
