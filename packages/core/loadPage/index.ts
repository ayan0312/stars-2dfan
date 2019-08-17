import { getHTMLString } from './getHTML'
import { Subject2DFan, Topic2DFan } from './getInformation'
import Article2DFan from './getArticle'
import { rules, ITotalInformations, IGameInformation, ITopicArticle } from '../data'
import Config from '../../config.json'
import { merge, verify2DFan, verifyURL, delay } from '../../utils'
import { tip } from '../../utils/logs'
import { cId } from '../../shared/id'

export interface ILoadPage {
    url: string
    remark: string
}

export default async function loadPage(URL: string, remark: string): Promise<ITotalInformations> {
    if (!verify2DFan(URL)) {
        throw '2dfan URL is not this typed:loadpage parameter is error'
    }

    if (Config.Cookie === '') {
        console.log('\n')
        tip(`Cookie is empty`, 'warn')
    }

    const mergeRemarkToRules = merge(rules, remark)
    try {
        const subject: IGameInformation = await getInformation(URL, mergeRemarkToRules)
        let topicContents: Array<ITopicArticle> = []
        if (subject.web2dfan.topicID) {
            topicContents = await Article2DFan.getArticle(subject.web2dfan.topicID)
        }
        return {
            subject,
            topic: {
                _id: cId(),
                subject_id: subject._id,
                html: topicContents,
            },
        }
    } catch (err) {
        throw err
    }
}

async function getInformation(URL: string, rules: IGameInformation): Promise<IGameInformation> {
    const urlTarget = URL
    if (verifyURL(urlTarget, 'subjects')) {
        return await Subject2DFan.getInformation(URL, rules)
    }
    if (verifyURL(urlTarget, 'topics')) {
        const $ = await getHTMLString(URL)
        const subjectURL = `https://www.2dfan.com/subjects/${Topic2DFan.getSubjectID($)}`
        await delay()
        return await getInformation(subjectURL, rules)
    }
    throw `The URL is typed error of router:${urlTarget}`
}
