;(function(am) {
    var am = am()

    let resolveModule = null

    am.resolve = function(module) {
        resolveModule = module
    }

    am.module = function() {
        var args = [].slice.call(arguments),
            callback = args.pop(),
            deps = args.length && args[args.length - 1] instanceof Array ? args.pop() : []
        var url = args.length ? args.pop() : null

        var params = [],
            depsCount = 0,
            i = 0
        if (deps.length) {
            while (i < deps.length) {
                ;(function(i) {
                    depsCount++
                    loadModule(deps[i], function(mod) {
                        params[i] = mod
                        depsCount--
                        if (depsCount === 0) {
                            params.unshift(resolveModule)
                            setModule(url, params, callback)
                        }
                    })
                })(i)
                i++
            }
        } else {
            setModule(url, [resolveModule], callback)
        }
    }

    var moduleCache = {}

    var setModule = function(moduleName, params, callback) {
        var _module, fn
        if (moduleCache[moduleName]) {
            _module = moduleCache[moduleName]
            _module.status = 'loaded'
            _module.exports = callback ? callback.apply(_module, params) : null
            while ((fn = _module.onload.shift())) {
                fn(_module.exports)
            }
        } else {
            callback && callback.apply(null, params)
        }
    }

    var loadModule = function(moduleName, callback) {
        var _module
        if (moduleCache[moduleName]) {
            _module = moduleCache[moduleName]
            if (_module.status === 'loaded') {
                setTimeout(callback(_module.exports), 4)
            } else {
                _module.onload.push(callback)
            }
        } else {
            moduleCache[moduleName] = {
                moduleName: moduleName,
                status: 'loading',
                exports: null,
                onload: [callback],
            }
            loadScript(getUrl(moduleName))
        }
    }

    var getUrl = function(moduleName) {
        return String(moduleName).replace(/\.js$/g, '') + '.js'
    }

    var loadScript = function(src) {
        var _script = document.createElement('script')
        _script.type = 'text/javascript'
        _script.async = true
        _script.src = src

        document.getElementsByTagName('head')[0].appendChild(_script)
    }
})(function() {
    return (window.am = {})
})
