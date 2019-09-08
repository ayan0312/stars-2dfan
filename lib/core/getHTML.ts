import superagent from 'superagent'
import cheerio from 'cheerio'
import Config from '../config.json'

export function getHTML(URL: string, Cookie: string = ''): superagent.SuperAgentRequest {
    return superagent
        .get(URL)
        .set('Cookie', Cookie)
}

export async function getHTMLString(URL: string): Promise<CheerioStatic> {
    try {
        const data: superagent.Response = await getHTML(URL, Config.Cookie)
        const $: CheerioStatic = cheerio.load(data.text)
        return $
    } catch (err) {
        throw `not found,Check for Cookie filling:${URL}`
    }
}

function filter404($: CheerioStatic): boolean {
    var not = $('.block>.navbar.navbar-inner.block-header>.title.pull-left').text()
    if (not.indexOf('404') !== -1) {
        return false
    }
    return true
}
