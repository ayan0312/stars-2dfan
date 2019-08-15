import cheerio from 'cheerio'
import { getHTML, getGameInfomation } from './getHTML'
import { IGameInformation } from '../data'
import Config from '../../config.json'
import { tip } from '../../shared/logs'
import { verifyURL } from '../../shared/verify'

export async function loadPage(URL: string, callback: (value: IGameInformation) => void) {
    if (!verifyURL(URL, '2dfan.com')) {
        tip(`This url is typed error`, 'error')
        return false
    }

    const data = await getHTML(URL, Config.Cookie)
    const $ = cheerio.load(data.text)
    const gameInfomation: IGameInformation = await getGameInfomation($, URL)
    callback(gameInfomation)
}
