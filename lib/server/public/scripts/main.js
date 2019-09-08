$(document).ready(function () {
    var windowTitle = window.WindowTitle.getInstance()

    function mainAarticle(page) {
        var article = $('<article class="content">正在加载中...</article>')
        window.getSubjects(page, function (results) {
            article.text('')
            window.setCardData(results, article, true)
        })
        return article
    }


    function mainPages(title, article, current) {
        var pages = new window.Page()
        var article = article
        pages.on(function (clickpage) {
            var newArticle = mainAarticle(clickpage)
            article.replaceWith(newArticle)
            windowTitle.changeTitleName(title, `游戏列表_${clickpage}`)
            article = newArticle
        })
        window.getAllpage(function (results) {
            console.log(results)
            var data = results.data
            var page = Math.ceil(data.count / data.num)
            article.before(pages.create(page, current))
        })
    }

    function pushWindowTitle(name, block) {
        var title = windowTitle.createWindowTitle($('.window-titles'), {
            name,
            block
        })
        return title
    }

    var currentPage = getQueryVariable('page') || 1
    var article = mainAarticle(currentPage)
    var title = pushWindowTitle(`游戏列表_${currentPage}`, article)
    mainPages(title, article, currentPage)
    $('main').append(title.block)
})
