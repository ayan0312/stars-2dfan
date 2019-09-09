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
        var open = $(`<i class="open card">闭</i>`)
        section.addClass('oneline')
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

    function Remark(string, id) {
        var textarea = $('<textarea></textarea>')
        textarea.val(string || '')
        var button = $('<button>更新备注</button>')
        button.bind('click', function () {
            updateRemark(textarea.val(), id, function (result) {
                console.log(result)
                textarea.after(`<p>更新成功</p>`)
            })
        })

        var remarkBox = $('<div class="remark"></div>')
        remarkBox.append(textarea)
        remarkBox.append(button)
        return remarkBox
    }

    function newRemark(string, data) {
        var textarea = $('<textarea></textarea>')
        textarea.val(string || '')
        var button = $('<button>确定收藏</button>')
        button.bind('click', function () {
            data.subject.remark = textarea.val()
            collectInsert(data, function (result) {
                if (result.data.ok === 1) {
                    alert('收藏成功, 请不要重复收藏')
                }
            })
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

    function createCard(options, main, newRemarkData) {
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
        if (newRemarkData) {
            Box.append(newRemark(options.remark, newRemarkData))
        } else {
            Box.append(Remark(options.remark, options._id))
        }
        Box[0].dataset._id = options._id
        main.append(Box)
    }

    function setSubject(result, main, newRemarkData) {
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
        }, main, newRemarkData)
    }

    function setCollectCardData(result, main, newRemarkData) {
        var data = result.data
        var subject = data.subject
        setSubject(subject, main, data)
        var topic = $(document).data(`topic_${data.subject._id}`)
        if (!topic) {
            if (data) {
                var html = data.topic.html
                var arr = []
                Object.keys(html).forEach((value, index) => {
                    arr = arr.concat(html[value].content)
                })
                var string = arr.join('').trim()
            }
            $(document).data(`topic_${data.subject._id}`, string)
        }
    }

    function setCardData(results, main, isPresent) {
        if (!results) return
        results.data.map(function (result) {
            if (isPresent) {
                preLoadTopic(result._id)
            }

            setSubject(result, main)
        })
    }

    window.createCard = createCard
    window.setCardData = setCardData
    window.setCollectCardData = setCollectCardData
})
