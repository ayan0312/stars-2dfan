am.module('js/src/Button', function(rg) {
    return (
        options = {
            name: '',
            click: null,
            info: [],
        },
    ) => {
        let styles = {
            outline: '#dc995a solid 1px',
            padding: '5px 20px',
            margin: '0 5px',
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

        let button = rg.createElement('button')
        button.innerText = '提交'

        rg.setCss(button, styles)

        return rg.render({
            node: button,
        })
    }
})
