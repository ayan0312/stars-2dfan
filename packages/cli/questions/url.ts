import inquirer from 'inquirer'
import { logStats } from '../../shared/logs'
import { loadPage } from '../../core/loadPage'
import { IGameInformation } from '../../core/data'
import Galgame from '../../core/models/galgame'

let galgameData: IGameInformation

const url: inquirer.QuestionCollection = [
    {
        type: 'input',
        name: 'url',
        message: '输入2DFan网站地址',
        validate(URL: any) {
            return new Promise((resolve, reject) => {
                loadPage(URL, (data: IGameInformation) => {
                    logStats({
                        data,
                        name: 'Data',
                        tip: 'Process',
                        type: 'success',
                    })
                    galgameData = data
                    resolve(true)
                })
            })
        },
    },
    {
        type: 'confirm',
        message: '是否保存到数据库',
        name: 'filter',
        when(answers: any) {
            return true
        },
    },
]

function saveToDatabase(data: IGameInformation) {
    if (galgameData === undefined) return false
    Galgame.connect().then((db: any) => {
        const galgame: Galgame = new Galgame(db, 'subject')
        galgame.create(data).then(result => {})
    })
}

export default function getURLAnswer() {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt(url)
            .then(answers => {
                if (answers.filter) {
                    saveToDatabase(galgameData)
                }
                resolve(answers)
            })
            .catch(error => {
                reject(error)
            })
    })
}
