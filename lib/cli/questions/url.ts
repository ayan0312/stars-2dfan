import inquirer from 'inquirer'
import { logStats, log } from '../../logs'
import { ITotalInformations } from '../../loadPage/data'
import loadPage from '../../loadPage/web2dfan'
import { Mongodb } from '../../core/mongodb'

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

                    const verifyData: any = await verifyGameName(data.subject.name)
                    if (verifyData) {
                        log('warn', 'Find game data with the same name')
                        logStats({
                            data: {
                                name: verifyData.name,
                                releaseDate: verifyData.releaseDate,
                                brand: verifyData.brand
                            },
                            name: 'Data',
                            tip: 'Repetition',
                        })
                    }

                    info = data
                } else {
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

async function verifyGameName(name: string): Promise<any | void> {
    const subjects: Mongodb = await Mongodb.connection('subjects')
    const getData: any = await subjects.find({
        name
    })
    if(getData[0] instanceof Array) return
    if(typeof getData[0] !== 'object') return
    if ('name' in getData[0]) {
        if (getData[0].name === name) {
            return getData[0]
        }
    }
}

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
