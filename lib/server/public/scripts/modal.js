$(document).ready(function () {
    function Modal() {
        this.mark = null
        this.modal = $(`<div class="modal" style="
            display: none;
            position: fixed;
            justify-content:center;
            align-items: center;
            flex-direction: row;
            width:100%;
            height:100%;
            top:0;
            left:0;
            z-index:101;
        "></div>`)

        this.close = $(`<i>关</i>`)
        this.content = null
        this.init()
    }

    Modal.prototype.init = function () {
        var _this = this
        this.close.click(function () {
            _this.hide()
        })
        this.modal.append(this.close)

        this.fastKey()
    }

    Modal.prototype.fastKey = function () {
        $(window).keydown((e) => {
            if (e.keyCode == 27) {
                this.hide()
            }
        })
    }

    Modal.prototype.createModal = function (isCreateMark, jQElement) {
        if (this.content) this.content.remove()
        this.content = jQElement
        this.modal.append(this.content)
        $('body').append(this.modal)
        if (isCreateMark) {
            this.createMark()
        }
    }

    Modal.prototype.addCloseClassName = function (className) {
        this.close.addClass(className)
        return this
    }

    Modal.prototype.changeCloseStyles = function (css) {
        this.close.css(css)
        return this
    }

    Modal.prototype.show = function () {
        if (this.mark) {
            this.showMark()
        }
        this.modal.css('display', 'flex')
    }

    Modal.prototype.hide = function () {
        if (this.mark) {
            this.hideMark()
        }
        this.modal.css('display', 'none')
    }

    Modal.prototype.hideMark = function () {
        this.mark.css('display', 'none')
    }

    Modal.prototype.showMark = function () {
        this.mark.css('display', 'block')
    }

    Modal.prototype.deleteMark = function () {
        this.mark = null
        return true
    }

    Modal.prototype.createMark = function () {
        if (this.mark === null) {
            this.mark = $(`<div class="mark" style="
                background:rgb(0, 0, 0,0.4);
                position: fixed;
                z-index:100;
                top:0;
                left:0;
                width:100%;
                height:100%;
                display:none;
            "></div>`)
        }
        this.modal.before(this.mark)
        return this.mark
    }

    var TheOneModal = false

    Modal.getInstance = function () {
        if (TheOneModal) {
            return TheOneModal
        } else {
            TheOneModal = new Modal()
            return TheOneModal
        }
    }

    window.beautifullyModal = Modal.getInstance
    window.beautifullyModal()
        .addCloseClassName('open')
        .addCloseClassName('card')
        .changeCloseStyles({
            zIndex: '999',
            top: '10%',
            left: '10%',
        })
})