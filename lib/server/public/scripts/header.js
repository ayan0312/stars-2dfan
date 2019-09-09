$(document).ready(function () {
    function Link(name) {
        var link = $(`<a href="javascript:;" class="link">${name}</a>`)
        return link
    }

    function createGameTitle() {
        window.createMain(1)
    }

    function createGameList() {
        var link = Link('游戏列表')
        link.bind('click', function () {
            createGameTitle()
        })
        return link
    }

    function createRemarkTitle() {
        window.createMain(1, function (page, article) {
            window.getRemarkSubjects(page, function (results) {
                article.text('')
                window.setCardData(results, article, true)
            })
        })
    }

    function createRemarkList() {
        var link = Link('所有备注')
        link.bind('click', function () {
            createRemarkTitle()
        })
        return link
    }

    $('header').append(createGameList())
    $('header').append(createRemarkList())
})