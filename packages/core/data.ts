import { IDownloadedInformation } from './download'

export interface IGameInformation {
    _id: string
    name: string
    anotherName: string
    brand: Array<string>
    releaseDate: Array<string>
    painter: Array<string>
    voiceActor: Array<string>
    scriptwriter: Array<string>
    musician: Array<string>
    singer: Array<string>
    image: IDownloadedInformation
    type: Array<string>
    web2dfan: I2DFan
    remark: string
    date: string
}

export interface I2DFan {
    subjectID: string
    imageURL?: string
    topicID?: string
}

export interface ITotalInformations {
    subject: IGameInformation
    topic?: ITopicArticles
}

export interface ITopicArticles {
    _id: string
    subject_id: string
    date: string
    html?: Array<ITopicArticle>
}

export interface ITopicArticle {
    page: number
    images?: Array<IDownloadedInformation>
    content: Array<string>
}
