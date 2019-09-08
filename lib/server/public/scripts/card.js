$(document).ready(function () {
    var events = Events()

    function Cover(imageURL) {
        var img1 = $(`
        <i class="background" style="
            background-image:url(${imageURL});
            background-position:center;
            background-repeat:no-repeat;
            background-size:contain;
        "></i>`)

        img1.bind('click', function () {
            var img2 = $(`<img src="${imageURL}" />`)
            var Modal = window.beautifullyModal()
            Modal.createModal(true, img2)
            Modal.show()
        })

        return img1
    }

    function Topic() {
        var topic_content = $(`<div class="topic-content"></div>`)
        var Topic = $(`<div class="topic">
            <p class="pre_load">正在加载中...</p>
        </div>`)

        var Modal = window.beautifullyModal()
        Modal.createModal(true, Topic)

        return {
            show() {
                Modal.show()
            },
            hide() {
                Modal.hide()
            },
            setContent(html) {
                if (Topic[0].children.length <= 1) {
                    Topic.html('')
                    Topic.append(topic_content)
                }
                topic_content.html(html)
            }
        }
    }

    function Title(name, id) {
        var a = $(`<a href="javascript:;" class="title" target="blank">${name}</a>`)
        a.bind('click', function (e) {
            var topicString = $(document).data(`topic_${id}`) || ''
            var box = Topic()
            box.show()
            if (topicString === '') {
                getTopic(id, function (data) {
                    var HTMLstring = data.data || '<p>暂无详细介绍</p>'
                    $(document).data(`topic_${id}`, HTMLstring)
                    box.setContent(HTMLstring)
                })
            } else {
                box.setContent(topicString)
            }
        })
        return $(`<figcaption></figcaption>`).append(a)
    }

    function Tag(name, dataArr, type) {
        dataArr = dataArr || []
        type = type || ''
        var aList = []
        if (type === 'p') {
            var HTML = `
                <span>${name} :</span>
                <span style="font-size:12px">${dataArr}</span>`
            return `<p>${HTML}</p>`
        }

        dataArr.map(function (value) {
            if (value) {
                aList.push(`
                    <a href="#" class=${type}>${value}</a>`)
            }
        })

        return `
            <p>
                <span>${name} :</span>
                ${aList.join('')}
            </p>`
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
            $('html,body').animate({ scrollTop: open.offset().top - 70 }, 0);
        })
        section.append(open)
        return open
    }

    function Remark(string) {
        var textarea = $('<textarea></textarea>')
        textarea.val(string || '')
        var button = $('<button>更新备注</button>')
        button.bind('click', function () {
            
        })

        var remarkBox = $('<div class="remark"></div>')
        remarkBox.append(textarea)
        remarkBox.append(button)
        return remarkBox
    }

    function shiftBox(figure) {
        var section = $(`<section></section>`)
        openBox(section)
        section.append(figure)
        return section
    }

    function createCard(options, main) {
        var figure = $(`<figure></figure>`)
        figure.append(Cover(`${LOCALHOST}/assets/images/` + options.filename))
        figure.append(Title(options.name, options._id))

        var blockquote = $(`
                <blockquote class="information">
                ${Tag('品牌', options.brands)}
                ${Tag('发售日期', options.releaseDate, 'p')}
                ${Tag('收录时间', options.date, 'p')}
                ${Tag('原画', options.painters)}
                ${Tag('标签', options.tags, 'tag')}
            </blockquote>`)
        figure.append(blockquote)

        var Box = shiftBox(figure)
        Box.append(Remark(options.remark))
        Box[0].dataset._id = options._id
        main.append(Box)
    }

    function setCardData(results, main, isPresent) {
        results.data.map(function (result) {
            if (isPresent) {
                preLoadTopic(result._id)
            }

            window.createCard({
                _id: result._id,
                brands: result.brand,
                painters: result.painter,
                tags: result.type,
                name: result.name,
                remark: result.remark,
                date: result.date,
                filename: `${result.image.name || 'package'}.${result.image.type || 'png'}`,
                releaseDate: result.releaseDate
            }, main)
        })
    }

    window.createCard = createCard
    window.setCardData = setCardData
})
