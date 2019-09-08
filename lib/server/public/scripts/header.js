$(document).ready(function () {
    function Link(name) {
        var link = $(`<a href="javascript:;" class="link">${name}</a>`)
        return link
    }

    function createGameTitle() {
        var page = getQueryVariable('page') || 1
        var article = $('<article class="content">正在加载中...</article>')
        getSubjects(page, function (results) {
            article.text('')
            window.setCardData(results, article, true)
        })

        var windowTitle = window.WindowTitle.getInstance()
        var title = windowTitle.createWindowTitle($('.window-titles'), {
            name: '游戏列表_' + page,
            block: article
        })

        window.createContent(title.block)
    }

    function createGameList() {
        var link = Link('游戏列表')
        link.bind('click', function () {
            createGameTitle()
        })
        return link
    }

    $('header').append(createGameList())
})