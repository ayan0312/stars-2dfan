am.module(
    'js/src/App',
    ['js/src/Input', 'js/src/AddInput', 'js/src/TextArea', 'js/src/Button'],
    function(rg, input, addInput, textArea, button) {
        let App = rg.createElement('div')

        let styles = {
            padding: '8px 20px',
            margin: '0 auto',
            'margin-top': '30px',
            width: '300px',
            'font-size': '14px',
            display: 'block',
            'text-align': 'center',
            'border-radius': '5px',
            'text-shadow': '0 -1px 0 rgba(0, 0, 0, 0.1)',
            'box-shadow': '0 2px 0 rgba(0, 0, 0, 0.025)',
            'user-select': 'none',
            transition: 'all .3s',
            border: '1px solid #803b39',
            color: '#803b39',
            'font-weight': 'bold',
            background: 'rgb(255, 243, 208)',
        }

        rg.setCss(App, styles)

        return {
            node: App,
            childNode: [
                input({
                    placeholder: '游戏名称：',
                }),
                input({
                    placeholder: '公司：',
                }),
                input({
                    placeholder: '发售时间：',
                }),
                addInput({
                    placeholder: '画师：',
                    type: 'input',
                }),
                addInput({
                    placeholder: '类型：',
                    type: 'tag',
                }),
                textArea({
                    placeholder: '游戏介绍：',
                }),
                button(),
            ],
        }
    },
)
