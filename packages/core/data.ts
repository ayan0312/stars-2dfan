export interface IGameInformation {
    name: string
    anotherName?: string
    brand?: Array<string>
    releaseDate?: Array<string>
    painter?: Array<string>
    voiceActor?: Array<string>
    scriptWriter?: Array<string>
    musician?: Array<string>
    singer?: Array<string>
    image?: IGameImageFileInformation
    type: Array<string>
    web2dfan: I2DFan
    timestamp: string
}

export interface IGameImageFileInformation {
    path: string
    filename: string
}

export interface I2DFan {
    subjectID: string
    imageURL?: string
    topicID?: string
}

export let rules: IGameInformation = {
    name: '',
    anotherName: '',
    brand: [],
    releaseDate: [],
    painter: [],
    voiceActor: [],
    scriptWriter: [],
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
    timestamp: '0',
}
