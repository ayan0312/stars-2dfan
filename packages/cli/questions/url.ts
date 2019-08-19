import inquirer from 'inquirer'
import { logStats, log } from '../../logs'
import { IGameInformation, ITotalInformations } from '../../core/data'
import loadPage from '../../core/loadPage'
import { Mongodb } from '../../core/models/mongodb'

let info: ITotalInformations

const url: inquirer.QuestionCollection = [
    {
        type: 'input',
        name: 'url',
        message: '输入2DFan网站地址',
        async validate(URL: any): Promise<boolean> {
            try {
                const data: ITotalInformations | void = await loadPage(URL, '')

                if (data) {
                    logStats({
                        data: data.subject,
                        name: 'Data',
                        tip: 'Process',
                    })

                    info = data
                }else{
                    return false
                }
            } catch (err) {
                log('error', err)
                return false
            }
            return true
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

async function insertAll(data: ITotalInformations): Promise<void> {
    if (data === undefined) return
    const { subject, topic } = data
    const subjects: Mongodb = await Mongodb.connection('subjects')
    subjects.insert(subject)
    if (!topic) return
    const topics: Mongodb = await Mongodb.connection('topics')
    topics.insert(topic)
}

export default async function getURLAnswer() {
    const answers: inquirer.Answers = await inquirer.prompt(url)
    if (answers.filter) {
        return await insertAll(info)
    }
}
