$(document).ready(function () {

    function TitleNode(options) {
        this.uuid = uuid()
        this.name = options.name
        this.block = this.createNewBlock(options.block)

        this.title = null
        this.open = null
        this.close = null

        this.next = null
        this.prev = null
    }

    TitleNode.prototype.createNewBlock = function (block) {
        var newBlock = $(`<div data-uuid="${this.uuid}" style="display:none"></div>`)
        newBlock.append(block)
        return newBlock
    }

    TitleNode.prototype.createTitle = function (title) {
        this.title = title.title
        this.open = title.open
        this.close = title.close
    }

    TitleNode.prototype.remove = function () {
        this.block.remove()
        if (this.title) {
            this.title.remove()
        }
    }

    function DoublyLinkedList() {
        var length = 0
        var head = null
        var tail = null

        this.size = function () {
            return length
        }

        this.indexOf = function (element) {
            var current = head
            var index = 0
            while (current) {
                if (element.uuid === current.uuid) {
                    return index
                }
                index++
                current = current.next
            }
            return -1
        }

        this.isEmpty = function () {
            return length === 0
        }

        this.getHead = function () {
            return head
        }

        this.getTail = function () {
            return tail
        }

        this.remove = function (element) {
            var index = this.indexOf(element)
            return this.removeAt(index)
        }

        this.insert = function (position, element) {
            if (position < 0 && position > length) return false
            var node = element
            var current = head
            var previous
            var index = 0
            if (position === 0) {
                if (!head) {
                    head = node
                    tail = node
                } else {
                    node.next = current
                    current.prev = node
                    head = node
                }
            } else if (position === length) {
                current = tail
                current.next = node
                node.prev = current
                tail = node
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                node.next = current
                previous.next = node

                current.prev = node
                node.prev = previous
            }

            length++
            return true
        }

        this.removeAt = function (position) {
            if (position < 0 && position >= length) return false
            var current = head
            var previous
            var index = 0
            if (position === 0) {
                head = current.next
                if (length === 1) {
                    tail = null
                } else {
                    head.prev = null
                }
            } else if (position === length - 1) {
                current = tail
                tail = current.next
                tail.next = null
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }

                previous.next = current.next
                current.next.prev = previous
            }
            length--
            return current.element
        }
    }

    function WindowTitle() {
        this.ul = $('<ul></ul>')
        this.linkedList = new DoublyLinkedList()

        this.prev = null
        this.current = null
    }

    WindowTitle.prototype = {
        createWindowTitle: function (main, options) {
            main.append(this.ul)
            if (options) {
                return this.pushTitle(options)
            }
        },
        createTitle: function (instance) {
            var title = $(`<li></li>`)
            var open = $(`<span title="${instance.name}">${instance.name}</span>`)
            var close = $(`<i class="close">×</i>`)
            title.append(open)
            title.append(close)
            instance.createTitle({
                close,
                open,
                title
            })
            this.ul.append(title)
            this._open(instance)
            return instance
        },
        pushTitle: function (options) {
            var node = this.createTitle(new TitleNode(options))
            this.linkedList.insert(0, node)
            this.bindEvents(node)
            return node
        },
        changeTitleName: function (title, name) {
            title.open.attr('title', name)
            title.open.text(name)
        },
        bindEvents: function (node) {
            node.close.bind('click', () => {
                this._close(node)
            })

            node.open.bind('click', () => {
                this._open(node)
            })
        },
        _open: function (node) {
            if (node !== this.current) {
                this.prev = this.current
                this.current = node

                this._show(this.current)
                if (this.prev) {
                    this._hide(this.prev)
                }
            }
        },
        _close: function (node) {
            this.linkedList.remove(node)
            this.prev = null

            this._hide(this.current)
            this.current = this.linkedList.getHead()
            if (this.current) {
                this._show(this.current)
            }
            node.remove()
        },
        _show: function (node) {
            node.title.addClass('current')
            node.block.css('display', 'block')
        },
        _hide: function (node) {
            node.title.removeClass('current')
            node.block.css('display', 'none')
        }
    }

    var TheOneWindowTitle = false

    WindowTitle.getInstance = function () {
        if (TheOneWindowTitle) {
            return TheOneWindowTitle
        } else {
            TheOneWindowTitle = new WindowTitle()
            return TheOneWindowTitle
        }
    }

    window.WindowTitle = WindowTitle
})