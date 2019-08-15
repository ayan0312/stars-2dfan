import superagent from 'superagent'

import Subject from './getSubject'
import { IGameInformation, rules } from '../data'
import { downloadImage } from '../download/image'

import Config from '../../config.json'
import { tip } from '../../shared/logs'
import { merge } from '../../shared/merge'
import { IDownloadedInformation } from '../download'

export function getHTML(URL: string, Cookie: string): superagent.SuperAgentRequest {
    if (Cookie === '') {
        console.log('\n')
        tip(`Cookie is empty`, 'warn')
    }

    return superagent.get(URL).set('Cookie', Cookie)
}

export function getGameInfomation($: CheerioStatic, URL: string): Promise<IGameInformation> {
    return new Promise(async (resolve: (value: IGameInformation) => void, reject) => {
        const subject = new Subject($)

        let group: IGameInformation = merge(rules, subject.getGroup())
        group = merge(group, {
            name: subject.getGameName(),
            type: subject.getGameTypes(),
            web2dfan: subject.get2DFan(URL),
            timestamp: new Date().getTime().toString(),
        })

        try {
            const downloadedInformation: IDownloadedInformation = await downloadImage({
                name: group.name,
                timestamp: group.timestamp,
                url: group.web2dfan.imageURL || '',
                path: Config.images.path,
            })

            if (downloadedInformation) {
                group = merge(group, {
                    image: {
                        filename: downloadedInformation.filename,
                        path: downloadedInformation.path,
                    },
                })
            }

            resolve(group)
        } catch (err) {
            tip(err, 'error')
        }
    })
}
