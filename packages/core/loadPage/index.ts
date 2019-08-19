import { getTopic } from './getArticle'
import { ITotalInformations, IGameInformation, ITopicArticles } from '../data'
import Config from '../../config.json'
import { verify2DFan } from '../../utils'
import { log } from '../../logs'
import { getSubject } from './getInformation'

export default async function loadPage(URL: string, remark: string): Promise<ITotalInformations | void> {
    if (!verify2DFan(URL)) {
        log('error', '2dfan URL is not this typed:loadpage parameter is error')
    }

    if (Config.Cookie === '') {
        console.log('\n')
        log('warn', 'Cookie is empty:"cli -C" setting')
    }
    const subject: IGameInformation | void = await getSubject(URL, { remark })
    if (subject) {
        try {
            const topic: ITopicArticles = await getTopic(subject._id, subject.web2dfan.topicID)
            return { subject, topic }
        } catch (err) {
            throw err
        }
    }
    return
}
