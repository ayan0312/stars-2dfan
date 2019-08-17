import { getHTMLString } from './getHTML'
import { ITopicArticle, IImageFileInformation } from '../data'
import { getURLRouter, delay, merge } from '../../utils'
import { tip } from '../../utils/logs'
import { downloadImages, IDownloadImageTypes } from '../download/image'
import Config from '../../config.json'

export default class Article2DFan {
    private $: CheerioStatic
    private topicID: string
    public topicContents: Array<ITopicArticle>

    constructor($: CheerioStatic, topicID: string) {
        this.$ = $
        this.topicID = topicID
        this.topicContents = []
    }

    public static async getArticle(topicID: string): Promise<Array<ITopicArticle>> {
        const url = `https://www.2dfan.com/topics/${topicID}`
        const $ = await getHTMLString(url)
        const article: Article2DFan = new Article2DFan($, topicID)
        const pagenum: number = article.getLastArticleNumber()
        await article.getArticlePages(pagenum)
        return article.topicContents
    }

    public getPagePath(pagenum: number): string {
        if (pagenum > 1) {
            return `https://www.2dfan.com/topics/${this.topicID}/page/${pagenum}`
        }
        return `https://www.2dfan.com/topics/${this.topicID}`
    }

    public getLastArticleNumber(): number {
        const href = this.$('#content-pagination>.pagination>ul>li:last-child>a').attr('href')
        return parseInt(getURLRouter(href, 'page'), 10)
    }

    private async downloadArticleImages(paths: Array<string>) {
        const downloadTypes: Array<IDownloadImageTypes> = []
        paths.forEach((value: string, index: number) => {
            if (value !== '') {
                const info = {
                    url: value,
                    name: `img:${index}`,
                    timestamp: new Date().getTime().toString(),
                    path: Config.images.path,
                }
                downloadTypes.push(info)
            }
        })

        return await downloadImages(downloadTypes)
    }

    private getAllImageSrc($: CheerioStatic): Array<string> {
        const images = $('#topic-content img')
        const length = images.length
        const paths: Array<string> = []
        for (let i = 0; i < length; i += 1) {
            paths.push(images.eq(i).attr('src'))
        }
        return paths
    }

    public async getArticlePage(URL: string): Promise<any | void> {
        const $: CheerioStatic = await getHTMLString(URL)
        const html = $('#topic-content').html()
        const imagePath = this.getAllImageSrc($)
        const images = await this.downloadArticleImages(imagePath)
        if (html) {
            const topic: Array<string> = html.split('\n').filter((value: string) => {
                return value && value.trim()
            })
            return {
                topic,
                images,
            }
        }
    }

    public async getArticlePages(pagenum: number) {
        for (let articleIndex = 1; articleIndex <= pagenum; articleIndex += 1) {
            const currentURL = this.getPagePath(articleIndex)
            await delay()
            const page = await this.getArticlePage(currentURL)
            if (page) {
                this.topicContents.push({
                    page: `${articleIndex}`,
                    images: page.images,
                    content: page.topic,
                })
            }
        }
    }
}
