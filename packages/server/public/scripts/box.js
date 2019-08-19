function throttle(func, wait) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args)
            }, wait)
        }
    }
}

function Events() {
    var events = {}
    return {
        on: function (type, func) {
            if (events[type]) {
                events[type].push(func)
            } else {
                events[type] = []
                events[type].push(func)
            }
        },
        trigger: function (type, data) {
            if (!events[type]) events[type] = []
            var length = events[type].length | 0
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    events[type][i](data)
                }
            }
        }
    }
}

(function (window) {
    var PATH = 'http://localhost:3000'
    var events = Events()

    function getSubjects(page, callback) {
        $.ajax({
            url: `${PATH}/subjects/${page}`,
            dataType: 'json',
            success: function (result) {
                callback(result)
            }
        })
    }


    function Cover(imageURL) {
        return `
            <i class="background" style="
                background-image:url(${imageURL});
                background-position:center;
                background-repeat:no-repeat;
                background-size:contain;
            "></i>
        `
    }

    function Title(route, name) {
        return `
            <figcaption>
                <a href="${route}" class="title" target="blank">${name}</a>
            </figcaption>
        `
    }

    function Tag(name, dataArr, type) {
        dataArr = dataArr || []
        type = type || ''
        var aList = []

        if (type === 'p') {
            return `
                <p>
                    <span>${name} :</span>
                    <span>${dataArr}</span>
                </p>
            `
        }

        dataArr.map(function (value) {
            if (value) {
                aList.push(`
                    <a href="#" class=${type}>${value}</a>
                `)
            }
        })

        return `
            <p>
                <span>${name} :</span>
                ${aList.join('')}
            </p>
        `
    }

    function openBox(section) {
        var open = $(`<i class="open card">开</i>`)

        open.bind('click', function (e) {
            var show = section.hasClass('oneline')
            events.trigger('openCard', show)
            if (show) {
                section.removeClass('oneline')
                open.text('开')
            } else {
                section.addClass('oneline')
                open.text('闭')

            }
            $('html,body').animate({ scrollTop: open.offset().top - 70 }, 555);
        })
        section.append(open)
        return open
    }

    function Remark() {
        var textarea = $('<textarea></textarea>')
        var button = $('<button>更新备注</button>')
        button.bind('click', function () {
            console.log(textarea.val())
        })

        var remarkBox = $('<div class="remark"></div>')
        remarkBox.append(textarea)
        remarkBox.append(button)
        return remarkBox
    }

    function shiftBox(figure) {
        var main = $('article.content')


        var section = $(`<section class=""></section>`)
        var oB = openBox(section)

        section.append(figure)
        section.append(Remark())
        main.append(section)

    }

    function createBox(options) {
        var brands = Tag('品牌', options.brands)
        var releaseDate = Tag('发售日期', options.releaseDate, 'p')
        var date = Tag('收录时间', options.date, 'p')
        var painters = Tag('原画', options.painters)
        var tags = Tag('标签', options.tags, 'tag')


        var figure = $(`
                <figure>
                    ${Cover(`${PATH}/assets/images/` + options.filename)}
                    ${Title(`${PATH}/topics/subject?id=${options.id}`, options.name)}
                    <blockquote class="information">
                        ${brands}
                        ${releaseDate}
                        ${painters}
                        ${date}
                        ${tags}
                    </blockquote>
                </figure>
            `)

        shiftBox(figure)
    }

    getSubjects(1, function (results) {
        console.log(results)
        results.data.map(function (result) {
            var id = result._id
            var brands = result.brand
            var painters = result.painter
            var tags = result.type
            var name = result.name
            var date = result.date
            var filename = `${result.image.name}.${result.image.type}`
            var releaseDate = result.releaseDate
            createBox({
                id,
                brands,
                painters,
                tags,
                name,
                date,
                filename,
                releaseDate
            })
        })
    })

    $.ready(function () {

    })
})(window)