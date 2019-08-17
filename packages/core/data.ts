import { ObjectId } from 'mongodb'

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
    image: IImageFileInformation
    type: Array<string>
    web2dfan: I2DFan
    remark: string
    timestamp: string
}

export interface IImageFileInformation {
    path: string
    filename: string
}

export interface I2DFan {
    subjectID: string
    imageURL?: string
    topicID?: string
}

export let rules: IGameInformation = {
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
        path: '',
        filename: '',
    },
    type: [],
    web2dfan: {
        subjectID: '',
        topicID: '',
        imageURL: '',
    },
    remark: '',
    timestamp: '0',
}

export interface ITotalInformations {
    subject: IGameInformation
    topic?: ITopicArticles
}

export interface ITopicArticles {
    _id: string
    subject_id: string
    html?: Array<ITopicArticle>
}

export interface ITopicArticle {
    page: string
    images?: Array<IImageFileInformation>
    content: Array<string>
}
