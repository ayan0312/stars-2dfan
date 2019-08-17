import { download, mkdirSync, IDownloadedInformation } from './index'
import { getImageType } from '../../utils/file'
import { tip } from '../../utils/logs'
import { getMd5Filename } from '../../shared/crypt'

export interface IDownloadImageTypes {
    name: string
    url: string
    path: string
    timestamp: string
}

export async function downloadImage(
    data: IDownloadImageTypes,
): Promise<IDownloadedInformation | undefined> {
    if (data.url === 'filter') {
        return
    }

    if (data.url === '') {
        tip(`No such image of file:${data.url}`, 'warn')
        return
    }

    try {
        mkdirSync(data.path)
    } catch (error) {
        throw error
    }

    const fileType = getImageType(data.url)
    if (!fileType) {
        throw `The image is errored of filename:${data.url}`
    }

    const filename = getMd5Filename({
        name: data.name,
        timestamp: data.timestamp,
    })

    try {
        const downloadInformation: IDownloadedInformation = await download({
            filename: `${filename}.${fileType}`,
            url: data.url,
            path: data.path,
        })

        return downloadInformation
    } catch (err) {
        tip(err, 'error')
        return
    }
}

export async function downloadImages(
    URL: Array<IDownloadImageTypes>,
): Promise<Array<IDownloadedInformation | undefined>> {
    if (URL.length === 0) return []
    let infos: Array<IDownloadedInformation | undefined> = []
    let info: IDownloadedInformation | undefined
    for (let i = 0; i < URL.length; i += 1) {
        info = await downloadImage(URL[i])
        console.log(info)
        infos.push(info)
    }

    return infos
}
