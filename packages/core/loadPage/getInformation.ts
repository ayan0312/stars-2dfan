import { IGameInformation, I2DFan } from '../data'
import { IDownloadedInformation } from '../download'
import { downloadImage } from '../download/image'
import {
    getURLRouter,
    merge,
    filter2DFanImageURL,
    verifyURL,
    delay,
    cId,
    format,
} from '../../utils'
import { log } from '../../logs'
import { getHTMLString } from './getHTML'
import { getMd5Name } from './crypto'

export namespace Topic2DFan {
    export function getSubjectID($: CheerioStatic): string {
        const subjectHref: string = $('.span12>.thumbnail>.caption>a').attr('href')
        let subjectID: string = ''
        if (subjectHref) subjectID = getURLRouter(subjectHref, 'subjects')
        return subjectID
    }

    export function getTopicID(URL: string): string {
        return getURLRouter(URL, 'topics')
    }
}

export async function getSubject(URL: string, add: object): Promise<IGameInformation | void> {
    const urlTarget: string = URL

    if (verifyURL(urlTarget, 'subjects')) {
        try {
            return await Subject2DFan.getInformation(URL, add)
        } catch (error) {
            throw error
        }
    }

    if (verifyURL(urlTarget, 'topics')) {
        try {
            const $: CheerioStatic = await getHTMLString(URL)
            const subjectURL: string = `https://www.2dfan.com/subjects/${Topic2DFan.getSubjectID($)}`
            await delay()
            return await getSubject(subjectURL, add)
        } catch (error) {
            throw error
        }
    }

    throw `The URL is typed error of router:${urlTarget}`
}

export class Subject2DFan {
    public $: CheerioStatic

    public rules: IGameInformation = {
        _id: '',
        name: '',
        anotherName: '',
        brand: [],
        releaseDate: [],
        painter: [],
        voiceActor: [],
        scriptwriter: [],
        musician: [],
        singer: [],
        image: {
            name: '',
            type: '',
            path: '',
            filename: '',
            size: '',
        },
        type: [],
        web2dfan: {
            subjectID: '',
            topicID: '',
            imageURL: '',
        },
        remark: '',
        date: '',
    }

    constructor($: CheerioStatic) {
        this.$ = $
    }

    public getGameName(): string {
        return this.$('div.navbar.navbar-inner.block-header.no-border > h3').text()
    }

    public static async getInformation(URL: string, add: object = {}): Promise<IGameInformation> {
        try {
            const $: CheerioStatic = await getHTMLString(URL)
            const subject: Subject2DFan = new Subject2DFan($)
            const rules: IGameInformation = merge(subject.rules, add)
            let group: IGameInformation = merge(rules, subject.getGroup())
            const date: string = format('y-M-d,H:m:s', new Date().getTime())
            group = merge(group, {
                date,
                _id: cId(),
                name: subject.getGameName(),
                type: subject.getGameTypes(),
                web2dfan: subject.get2DFan(URL),
            })

            group = await this.mergeDownloadedInformation(group)
            return group
        } catch (error) {
            throw error
        }
    }

    public static async mergeDownloadedInformation(
        data: IGameInformation,
    ): Promise<IGameInformation> {
        let group: IGameInformation = data

        const name: string = getMd5Name(group.name, group._id)
        const url: string = group.web2dfan.imageURL || ''

        try {
            const downloadedInformation: IDownloadedInformation | undefined = await downloadImage({
                name,
                url,
            })

            if (downloadedInformation) {
                group = merge(group, {
                    image: downloadedInformation,
                })
            }
        } catch (err) {
            log('error', err)
        }

        return group
    }

    private allTypes: Array<string> = [
        '品牌',
        '发售日期',
        '原画',
        '声优',
        '剧本',
        '音乐',
        '歌手',
        '又名',
        '介绍',
        '攻略',
        '感想',
        '下载',
        '获取正版',
        'TAG',
    ]

    private chooseType(type: string): string {
        switch (type) {
            case '名称':
                return 'name'
            case '又名':
                return 'anotherName'
            case '品牌':
                return 'brand'
            case '发售日期':
                return 'releaseDate'
            case '原画':
                return 'painter'
            case '声优':
                return 'voiceActor'
            case '剧本':
                return 'scriptwriter'
            case '音乐':
                return 'musician'
            case '歌手':
                return 'singer'
            case 'TAG':
                return 'type'
        }
        return 'other'
    }

    private stringToArray(data: string): Array<string> {
        const typeArray: Array<string> = data.split('\n').map(val => {
            return val.trim()
        })
        if (typeArray[0] === '') typeArray.shift()
        return typeArray
    }

    private stringToObject(
        data: string,
        allTypes: Array<string> = this.allTypes,
    ): IGameInformation {
        const totalData: any = {}
        let prevType: string
        let prevData: Array<string>
        allTypes.forEach((type, index) => {
            const currentType: string = type
            let currentData: Array<any> = []
            if (data.indexOf(type) !== -1) {
                if (index === 0) {
                    currentData = data.split(`${type}：`)
                } else {
                    currentData = prevData[1].split(`${type}：`)
                    currentData[0] = this.stringToArray(currentData[0])
                    if (index === allTypes.length - 1) {
                        totalData[this.chooseType(prevType)] = currentData[0]
                        totalData[this.chooseType(currentType)] = this.stringToArray(currentData[1])
                    } else {
                        totalData[this.chooseType(prevType)] = currentData[0]
                    }
                }
                prevType = currentType
                prevData = currentData
            } else {
                return false
            }
        })
        return totalData
    }

    public getGameTypes(): Array<string> {
        const types: Array<string> = []
        this.$('.block-content.collapse.in.tags > a').map((index, val) => {
            const type: string | undefined = val.children[0].data
            if (type) types.push(type)
        })
        return types
    }

    public getCoverImageURL(): string {
        return this.$('.span8>.media>#package-image>.media-object').attr('src')
    }

    public getGroup(): IGameInformation {
        const groupString: string = this.getGroupString()
        const group: IGameInformation = this.stringToObject(groupString)
        return group
    }

    private getGroupString(): string {
        const group: Cheerio = this.$('.span8>.media>.media-body.control-group')
            .eq(0)
            .find('p.tags')
        let groupString: string = ''
        for (let groupIndex: number = 0; groupIndex < group.length; groupIndex += 1) {
            groupString += group
                .eq(groupIndex)
                .text()
                .trim()
        }

        return groupString
    }

    public getSubjectID(URL: string): string {
        return getURLRouter(URL, 'subjects')
    }

    public getTopicID(): string {
        const topicHref: string = this.$(
            '.block > .block-content.collapse.in >.text-center >.btn',
        ).attr('href')
        let topicID: string = ''
        if (topicHref) topicID = getURLRouter(topicHref, 'topics')
        return topicID
    }

    public get2DFan(URL: string): I2DFan | undefined {
        if (URL.split('www.2dfan.com/')[1].indexOf('subjects') !== 0) return undefined
        let imageURL: string | false = filter2DFanImageURL(this.getCoverImageURL())
        if (!imageURL) {
            log('warn', `This URL is typed error:${imageURL}`)
            imageURL = ''
        }
        if (imageURL === 'filter') {
            log('warn', `This image is filtered:${imageURL}`)
            imageURL = 'filter'
        }
        return {
            imageURL,
            subjectID: this.getSubjectID(URL),
            topicID: this.getTopicID(),
        }
    }
}
