am.module('js/src/TagInput', function(rg) {
    let defaultOptions = {
        name: '',
        click: null,
        change: null,
        text: '',
        info: null,
        placeholder: '',
        high: [],
    }

    let TagInput = function(options = defaultOptions) {
        let styles = {
            padding: '5px 10px',
            margin: '5px 5px',
            'font-size': '14px',
            display: 'inline-block',
            'text-align': 'center',
            'border-radius': '5px',
            'text-shadow': '0 -1px 0 rgba(0, 0, 0, 0.1)',
            'box-shadow': '0 2px 0 rgba(0, 0, 0, 0.025)',
            'user-select': 'none',
            cursor: 'pointer',
            transition: 'all .3s',
            border: '1px solid #803b39',
            color: '#803b39',
            'font-weight': 'bold',
            background: '#fff',
        }

        let TagInput = rg.createElement('div')
        TagInput.innerText = options.text

        rg.setCss(TagInput, styles)

        return rg.render({
            node: TagInput,
        })
    }

    return TagInput
})
