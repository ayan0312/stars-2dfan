am.module('js/src/AddInput', ['js/src/TagInput', 'js/src/Input'], function(rg, TagInput, Input) {
    let currentNumber = 0

    function getcurrentNumber(type) {
        if (type === 'add') {
            currentNumber += 1
        } else if (type === 'dec') {
            currentNumber -= 1
        }

        return currentNumber
    }

    function removeNewInput(num, currentElement, removeElement) {
        while (num--) {
            if (currentElement.children.length > 3) {
                getcurrentNumber('dec')
                currentElement.removeChild(removeElement.nextSibling)
            }
        }
    }

    return (
        options = {
            name: '',
            placeholder: '',
            click: null,
            info: [],
            type: '',
        },
    ) => {
        let inputOptions = {
            name: options.name,
            click: options.click,
            placeholder: options.placeholder,
        }

        let getInfo = ''
        inputOptions.info = getInfo

        let styles = {
            outline: '#dc995a solid 1px',
            padding: '0 10px',
            margin: '0 5px',
            'font-size': '16px',
            display: options.type === 'input' ? 'inline-block' : 'none',
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

        function addNewInput(val, element) {
            let num = getcurrentNumber('add')

            if (options.type === 'input') {
                rg.insertAfter(
                    Input({
                        placeholder: '新增' + num,
                        text: val || '',
                    }),
                    element,
                )
            } else if (options.type === 'tag') {
                rg.insertAfter(
                    TagInput({
                        text: val || '',
                    }),
                    element,
                )
            }
        }

        let addButton = rg.createElement('button')
        let decButton = rg.createElement('button')

        addButton.innerText = '+'
        rg.setCss(addButton, styles)

        decButton.innerText = '-'
        rg.setCss(decButton, styles)

        decButton.addEventListener(
            'click',
            function(e) {
                removeNewInput(1, decButton.parentElement, decButton)
            },
            false,
        )

        addButton.addEventListener(
            'click',
            function(e) {
                addNewInput('', decButton)
            },
            false,
        )

        inputOptions.high = e => {
            e.label.appendChild(addButton)
            e.label.appendChild(decButton)

            e.input.style.display = 'block'
        }

        let firstInputText = ''

        inputOptions.change = e => {
            let text = e.target.value

            if (text !== '') {
                if (currentNumber != 0) {
                    removeNewInput(currentNumber, decButton.parentElement, decButton)
                }

                let textArray = []

                if (text.split(' ').length > 0) textArray = text.split(' ')
                if (text.split(',').length > 0) textArray = text.split(',')

                textArray.map((val, index) => {
                    if (index === 0 && options.type === 'input') {
                        firstInputText = val
                    } else {
                        addNewInput(val, decButton)
                    }
                })

                e.target.value = firstInputText
            }
        }

        let addInput = Input(inputOptions)

        return rg.render({
            node: addInput,
        })
    }
})
