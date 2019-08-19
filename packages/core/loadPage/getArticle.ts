import { getHTMLString } from './getHTML'
import { ITopicArticle, ITopicArticles } from '../data'
import { getURLRouter, delay, cId, base64, merge, format } from '../../utils'
import { downloadImages, IDownloadImageTypes } from '../download/image'
import { IDownloadedInformation } from '../download'
import Config from '../../config.json'

export async function getTopic(
    subjectDatabaseid: string,
    topicID?: string,
): Promise<ITopicArticles> {
    const topicContents: Array<ITopicArticle> = await Article2DFan.getArticle(topicID)
    const date: string = format('y-M-d,H:m:s', new Date().getTime())
    return {
        date,
        subject_id: subjectDatabaseid,
        _id: cId(),
        html: topicContents,
    }
}

export default class Article2DFan {
    private $: CheerioStatic
    private topicID: string

    public articleRules: ITopicArticle = {
        page: -1,
        images: [],
        content: [],
    }

    constructor($: CheerioStatic, topicID: string) {
        this.$ = $
        this.topicID = topicID
    }

    public static async getArticle(topicID?: string): Promise<Array<ITopicArticle>> {
        if (!topicID) return []
        const topicURL: string = `https://www.2dfan.com/topics/${topicID}`
        const $: CheerioStatic = await getHTMLString(topicURL)
        const article: Article2DFan = new Article2DFan($, topicID)
        const pageMaxNumber: number = article.getLastArticleNumber()
        return await article.getArticleNumberContents(pageMaxNumber)
    }

    public async getArticleNumberContents(pageMaxNumber: number): Promise<Array<ITopicArticle>> {
        const topicContents: Array<ITopicArticle> = []
        for (let pageNumber: number = 1; pageNumber <= pageMaxNumber; pageNumber += 1) {
            const currentURL: string = this.getPageNumberPath(pageNumber)
            await delay()
            const totalAritcle: ITopicArticle = await this.getArticleContent(currentURL, pageNumber)
            topicContents.push(totalAritcle)
        }
        return topicContents
    }

    private getPageNumberPath(pageNumber: number): string {
        if (pageNumber > 1) {
            return `https://www.2dfan.com/topics/${this.topicID}/page/${pageNumber}`
        }
        return `https://www.2dfan.com/topics/${this.topicID}`
    }

    private getLastArticleNumber(): number {
        const href: string | undefined = this.$(
            '#content-pagination>.pagination>ul>li:last-child>a',
        ).attr('href')
        if (href === undefined) {
            return 1
        }
        return parseInt(getURLRouter(href, 'page'), 10)
    }

    private getHTMLAllImagePaths($: CheerioStatic): Array<string> {
        const images: Cheerio = $('#topic-content img')
        const length: number = images.length
        const paths: Array<string> = []
        for (let i = 0; i < length; i += 1) {
            let image: string = images.eq(i).attr('src')
            if (image.indexOf('-watermark') !== -1) image = image.split('-watermark')[0]
            paths.push(image)
        }
        return paths
    }

    private encodeName(index: number, pageNumber: number): string {
        const key: object = {
            index,
            topicID: this.topicID,
            page: pageNumber,
        }
        return base64.encode(JSON.stringify(key))
    }

    private async downloadArticleImages(
        paths: Array<string>,
        pageNumber: number,
    ): Promise<Array<IDownloadedInformation | undefined>> {
        const downloadImageTypes: Array<IDownloadImageTypes> = []
        paths.forEach((value: string, index: number) => {
            if (value) {
                const name: string = this.encodeName(index, pageNumber)
                const type: IDownloadImageTypes = {
                    name,
                    url: value,
                }
                downloadImageTypes.push(type)
            }
        })
        return await downloadImages(downloadImageTypes)
    }

    private replaceDownloadedImagesToHTML(
        $: CheerioStatic,
        images: Array<IDownloadedInformation | undefined>,
    ): string | null {
        const html: Cheerio = $('#topic-content')
        const htmlImages: Cheerio = html.find('img')
        const length: number = htmlImages.length
        for (let i = 0; i < length; i += 1) {
            const image: IDownloadedInformation | undefined = images[i]
            if (image === undefined) continue
            html.find('img')
                .eq(i)
                .attr('src', `${Config.server.imagesPath}${image.name}.${image.type}`)
        }
        return html.html()
    }

    public async getArticleContent(URL: string, pageNumber: number): Promise<ITopicArticle> {
        const $: CheerioStatic = await getHTMLString(URL)
        const allImagePaths: Array<string> = this.getHTMLAllImagePaths($)
        const downloadedImages: Array<
            IDownloadedInformation | undefined
        > = await this.downloadArticleImages(allImagePaths, pageNumber)
        const html: string | null = this.replaceDownloadedImagesToHTML($, downloadedImages)

        let content: Array<string> = []
        if (html) {
            content = html.split('\n').filter((value: string) => {
                return value && value.trim()
            })
        }

        return merge(this.articleRules, {
            content,
            page: pageNumber,
            images: downloadedImages,
        })
    }
}
