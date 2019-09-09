$(document).ready(function () {
    function Input(placeholder) {
        var input = $(`<input type="text" style="margin:0" placeholder="${placeholder}">`)
        return input
    }

    function Submit(name) {
        var submit = $(`<button style="margin:0 0 0 5px">${name}</button>`)
        return submit
    }

    function createSearchResult(query) {
        function find(page, article) {
            findTypes(query, function (results) {
                article.text('')
                window.setCardData(results, article, true)
            })
        }

        var article = window.mainArticle(1, find)
        var title = window.pushWindowTitle(`搜索_${query.name}`, article)
        mainPages({
            title,
            article,
            callback: find
        })
        $('main').append(title.block)
    }

    function Search() {
        var input = Input('游戏名、原画、剧本、标签（空格分割）')
        var submit = Submit('搜索')
        var search = $(`<div class="search"></div>`)
        submit.bind('click', function () {
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

        search.append(input)
        search.append(submit)
        $('nav').append(search)
    }

    function createCollectResult(query) {

        function find(page, article) {
            collectQuery(query.URL, query.remark, function (result) {
                article.text('')
                window.setCollectCardData(result, article)
            })
        }

        var article = window.mainArticle(1, find)
        var title = window.pushWindowTitle(`收藏_${query.URL}`, article)
        mainPages({
            title,
            article,
            callback: find
        })
        $('main').append(title.block)
    }

    function Collect() {
        var input = Input('Subject URL、Topic URL')
        var remark = Input('备注')
        var submit = Submit('收藏')
        var collect = $(`<div class="collect"></div>`)

        submit.bind('click', function () {
            var value = input.val()
            var valueRemark = remark.val()
            var query = {}
            if (value !== '') {
                query.URL = value
            }

            if (valueRemark !== '') {
                query.remark = valueRemark
            }
            console.log(query)
            createCollectResult(query)
        })

        collect.append(input)
        collect.append(remark)
        collect.append(submit)
        $('nav').append(collect)
    }


    function start() {
        Search()
        Collect()
    }

    start()
})