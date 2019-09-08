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

    $('header').append(createGameList())
})