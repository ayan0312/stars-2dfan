import { IGameInformation, I2DFan } from '../data'
import Config from '../../config.json'
import { verifyURL } from '../../shared/verify'
import { tip } from '../../shared/logs'

export function filter2DFanImageURL(URL: string): string | false {
    if (!verifyURL(URL, 'img.2dfan.com')) return false
    if (Config.download.filters) {
        let isFilter = false
        Config.download.filters.some((value: string) => {
            if (URL.indexOf(value) !== -1) {
                isFilter = true
                return true
            }
        })
        if (isFilter) return 'filter'
    }
    if (URL.indexOf('?') === -1) return URL
    if (URL.indexOf('?imageMogr') !== -1) return URL.split('?imageMogr')[0]
    return URL.split('?')[0]
}

export default class Subject {
    private $: CheerioStatic

    constructor($: CheerioStatic) {
        this.$ = $
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
    ]

    public getGameName(): string {
        return this.$('div.navbar.navbar-inner.block-header.no-border > h3').text()
    }

    public getGameTypes(): Array<string> {
        const types: Array<string> = []
        this.$('.block-content.collapse.in.tags > a').map((index, val) => {
            const type = val.children[0].data
            if (type) types.push(type)
        })
        return types
    }

    public getImageURL(): string {
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
        let subjectHref: string = URL.split('www.2dfan.com/subjects/')[1]
        let subjectID: string = ''
        if (subjectHref.indexOf('?') !== -1) subjectHref = subjectHref.split('?')[0]
        if (subjectHref.indexOf('/') !== -1) subjectHref = subjectHref.split('/')[0]
        subjectID = subjectHref
        return subjectID
    }

    public getTopicID(): string {
        let topicHref: string = this.$(
            '.block > .block-content.collapse.in >.text-center >.btn',
        ).attr('href')
        let topicID: string = ''
        if (topicHref) {
            topicHref = topicHref.split('/topics/')[1]
            topicID = topicHref
        }
        return topicID
    }

    public get2DFan(URL: string): I2DFan | undefined {
        if (URL.split('www.2dfan.com/')[1].indexOf('subjects') !== 0) return undefined
        let imageURL: string | false = filter2DFanImageURL(this.getImageURL())
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
                return 'scriptWriter'
            case '音乐':
                return 'musician'
            case '歌手':
                return 'singer'
            case '标签':
                return 'type'
        }
        return 'other'
    }

    private stringToArray(data: string): Array<string> {
        const typeArray = data.split('\n').map(val => {
            return val.trim()
        })
        if (typeArray[0] === '') typeArray.shift()
        return typeArray
    }

    private stringToObject(data: string): IGameInformation {
        const totalData: any = {}
        let prevType: string
        let prevData: Array<string>
        this.allTypes.forEach((type, index) => {
            const currentType: string = type
            let currentData: Array<any> = []
            if (data.indexOf(type) !== -1) {
                if (index === 0) {
                    currentData = data.split(`${type}：`)
                } else {
                    currentData = prevData[1].split(`${type}：`)
                    currentData[0] = this.stringToArray(currentData[0])
                    if (index === this.allTypes.length - 1) {
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
