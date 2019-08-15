am.module('js/src/Input', function(rg) {
    return (
        options = {
            name: '',
            click: null,
            change: null,
            text: '',
            info: null,
            placeholder: '',
            high: [],
        },
    ) => {
        let styles = {
            color: ' rgb(130, 57, 53)',
            background: 'none',
            outline: 'none',
            border: '0px',
            display: 'block',
            margin: '5px auto',
            width: '160px',
            padding: '3px 5px',
            'font-size': '14px',
            'text-decoration': 'underline',
            background: '#fff',
            border: '1px solid #803b39',
            'border-radius': '5px',
        }

        let label = rg.createElement('div')
        label.innerText = options.name || ''
        label.style.display = 'block'

        let input = rg.createElement('input')
        input.type = 'text'
        input.value = options.text || ''

        if (options.info || options.change) {
            input.addEventListener(
                'change',
                function(e) {
                    options.info = input.text

                    options.change(e)
                },
                false,
            )
        }

        if (options.placeholder) {
            input.setAttribute('placeholder', options.placeholder)
        }

        if (options.high) {
            options.high({ label, input })
        }

        rg.setCss(input, styles)

        label.appendChild(input)

        return rg.render({
            node: label,
        })
    }
})
