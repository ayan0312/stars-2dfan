import inquirer from 'inquirer'
import { logStats, tip } from '../../utils/logs'
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
                const data: ITotalInformations = await loadPage(URL, '')

                logStats({
                    data: data.subject,
                    name: 'Data',
                    tip: 'Process',
                    type: 'success',
                })

                info = data
            } catch (err) {
                tip(err, 'error')
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
    if (info === undefined) return
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
