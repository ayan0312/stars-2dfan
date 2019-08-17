import { IGameInformation, I2DFan } from '../data'
import { IDownloadedInformation } from '../download'
import { downloadImage } from '../download/image'
import Config from '../../config.json'
import { getURLRouter, merge, filter2DFanImageURL } from '../../utils'
import { tip } from '../../utils/logs'
import { getHTMLString } from './getHTML'
import { cId } from '../../shared/id'

export class Crawler2DFanInformation {
    public $: CheerioStatic

    constructor($: CheerioStatic) {
        this.$ = $
    }

    public getGameName(): string {
        return this.$('div.navbar.navbar-inner.block-header.no-border > h3').text()
    }

    public static async mergeDownloadedInformation(
        data: IGameInformation,
    ): Promise<IGameInformation> {
        let group = data

        try {
            const downloadedInformation: IDownloadedInformation | undefined = await downloadImage({
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
        } catch (err) {
            tip(err, 'error')
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

    protected chooseType(type: string): string {
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

    protected stringToArray(data: string): Array<string> {
        const typeArray = data.split('\n').map(val => {
            return val.trim()
        })
        if (typeArray[0] === '') typeArray.shift()
        return typeArray
    }

    protected stringToObject(
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
}

export class Subject2DFan extends Crawler2DFanInformation {
    constructor($: CheerioStatic) {
        super($)
    }

    public static async getInformation(
        URL: string,
        rules: IGameInformation,
    ): Promise<IGameInformation> {
        const $ = await getHTMLString(URL)
        const subject: Subject2DFan = new Subject2DFan($)
        let group: IGameInformation = merge(rules, subject.getGroup())
        group = merge(group, {
            _id: cId(),
            name: subject.getGameName(),
            type: subject.getGameTypes(),
            web2dfan: subject.get2DFan(URL),
            timestamp: new Date().getTime().toString(),
        })
        group = await this.mergeDownloadedInformation(group)
        return group
    }

    public getGameTypes(): Array<string> {
        const types: Array<string> = []
        this.$('.block-content.collapse.in.tags > a').map((index, val) => {
            const type = val.children[0].data
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
            tip(`This URL is typed error:${imageURL}`, 'warn')
            imageURL = ''
        }
        if (imageURL === 'filter') {
            tip(`This image is filtered:${imageURL}`, 'warn')
            imageURL = 'filter'
        }
        return {
            imageURL,
            subjectID: this.getSubjectID(URL),
            topicID: this.getTopicID(),
        }
    }
}

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
