import superagent from 'superagent'
import cheerio from 'cheerio'
import Config from '../../config.json'

export function getHTML(URL: string, Cookie: string = ''): superagent.SuperAgentRequest {
    return superagent.get(URL).set('Cookie', Cookie)
}

export async function getHTMLString(URL: string): Promise<CheerioStatic> {
    const data = await getHTML(URL, Config.Cookie)
    const $ = cheerio.load(data.text)
    return $
}
