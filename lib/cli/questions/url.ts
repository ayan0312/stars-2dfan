import inquirer from 'inquirer'
import { logStats, log } from '../../logs'
import { ITotalInformations } from '../../loadPage/data'
import { verifyGameName, insertAll } from '../../loadPage/web2dfan/collect'
import loadPage from '../../loadPage/web2dfan'

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

export default async function getURLAnswer() {
    const answers: inquirer.Answers = await inquirer.prompt(url)
    if (answers.filter) {
        return await insertAll(info)
    }
}
