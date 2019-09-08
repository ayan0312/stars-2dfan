import inquirer from 'inquirer'

const path: inquirer.QuestionCollection = [
    {
        type: 'input',
        name: 'path',
        message: 'Set the image into my project directory',
        validate(path: any) {
            return true
        },
    },
    {
        type: 'confirm',
        message: 'Confirm path',
        name: 'filter',
        when(answers: any) {
            return true
        },
    },
]

export default function getPathAnswer() {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt(path)
            .then(answers => {
                resolve(answers)
            })
            .catch(error => {
                reject(error)
            })
    })
}
