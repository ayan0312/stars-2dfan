import cheerio from 'cheerio'
import { getHTML, getGameInfomation } from './getHTML'
import { IGameInformation, rules } from '../data'
import Config from '../../config.json'
import { tip } from '../../shared/logs'
import { verifyURL } from '../../shared/verify'
import { merge } from '../../shared/merge';

export async function loadPage(URL: string, callback: (value: IGameInformation) => void, add: object = {}) {
    if (!verifyURL(URL, '2dfan.com')) {
        tip(`This url is typed error`, 'error')
        return false
    }

    let setRules = merge(rules, add)
    const data = await getHTML(URL, Config.Cookie)
    const $ = cheerio.load(data.text)
    const gameInfomation: IGameInformation = await getGameInfomation($, URL, setRules)
    callback(gameInfomation)
}
