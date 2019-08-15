am.module('js/src/TextArea', function(rg) {
    return (
        options = {
            name: '',
            click: null,
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
            width: '200px',
            height: '200px',
            padding: '3px 5px',
            'font-size': '14px',
            background: '#fff',
            border: '1px solid #803b39',
            'border-radius': '5px',
            resize: 'vertical',
        }

        let label = rg.createElement('div')
        label.innerText = options.name || ''
        label.style.display = 'block'

        let textArea = rg.createElement('textArea')
        textArea.type = 'text'

        if (options.info) {
            textArea.addEventListener(
                'change',
                function(e) {
                    options.info = textArea.text
                },
                false,
            )
        }

        if (options.placeholder) {
            textArea.setAttribute('placeholder', options.placeholder)
        }

        if (options.high) {
            textArea.high({ label, textArea })
        }

        rg.setCss(textArea, styles)

        label.appendChild(textArea)

        return rg.render({
            node: label,
        })
    }
})
