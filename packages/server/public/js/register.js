;(function(window) {
    function setCookie(cname, cvalue, exdays) {
        var d = new Date()
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
        var expires = 'expires=' + d.toGMTString()
        document.cookie = cname + '=' + cvalue + '; ' + expires
    }

    function getCookie(cname) {
        var name = cname + '='
        var ca = document.cookie.split(';')
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim()
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length)
        }
        return ''
    }

    function createElement(type) {
        let node = document.createElement(type)
        return node
    }

    function render(node, app) {
        let each = (element, index) => {
            if (element['childNode']) {
                element['childNode'].map((val, i) => {
                    element['node'].appendChild(val)
                })
            }

            return element['node']
        }
        node = each(node)
        if (app) {
            let App = document.getElementById(app)
            App.appendChild(node)
        }
        return node
    }

    let Register = function() {
        this.elements = null

        let config = getCookie('RConfig') || {}

        this.saveConfig = newConfig => {
            config = newConfig
        }

        this.getConfig = () => {
            return config
        }
    }

    Register.createElement = createElement
    Register.render = render
    Register.insertAfter = function(newNode, curNode) {
        curNode.parentNode.insertBefore(newNode, curNode.nextElementSibling)
    }

    Register.setCss = function(target, styles) {
        for (var k in styles) {
            target.style[k] = styles[k]
        }
    }

    window.Register = Register
})(window)
