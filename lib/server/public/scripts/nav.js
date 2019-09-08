$(document).ready(function () {
    function Input() {
        var input = $(`<input type="text" style="margin:0" placeholder="游戏名、原画、剧本、标签（空格分割）">`)
        return input
    }

    function Submit() {
        var submit = $(`<button style="margin:0 0 0 5px">搜索</button>`)
        return submit
    }

    function Search() {
        var input = Input()
        var submit = Submit()
        submit.click(function () {
            var value = input.val()
            if (value !== '') {
                var query = {}
                var arr = value.split(' ').filter(function (value) {
                    return value.trim() === '' ? false : true
                })
                if (arr.length === 1) {
                    query.name = arr[0]
                } else {
                    arr.forEach(function (value, index) {
                        switch (index) {
                            case 0:
                                query.name = value
                                break
                            case 1:
                                query.painter = value
                                break
                            case 2:
                                query.scriptwriter = value
                                break
                            case 3:
                                query.type = [value]
                                break
                            default:
                                query.push(value)
                                break
                        }
                    })
                }
                createSearchResult(query)
            }
            return
        })

        $('nav').append(input)
        $('nav').append(submit)
    }

    function createSearchResult(query) {
        var article = $('<article class="content">正在加载中...</article>')
        var windowTitle = window.WindowTitle.getInstance()
        var title = windowTitle.pushTitle({
            name: `搜索_${query.name}`,
            block: article
        })
        window.createContent(title.block)
        findTypes(query, function (results) {
            article.text('')
            window.setCardData(results, article, true)
        })
    }

    Search()
})