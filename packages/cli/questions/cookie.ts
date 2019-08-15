import inquirer from 'inquirer'

const cookie: inquirer.QuestionCollection = [
    {
        type: 'input',
        name: 'Cookie',
        message: '2DFan Cookie',
        validate(cookie: any) {
            return true
        },
    },
    {
        type: 'confirm',
        message: 'Confirm Cookie',
        name: 'filter',
        when(answers: any) {
            return true
        },
    },
]

export default function getCookieAnswer() {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt(cookie)
            .then(answers => {
                resolve(answers)
            })
            .catch(error => {
                reject(error)
            })
    })
}
