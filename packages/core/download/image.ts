import { download, IDownloadedInformation } from './index'
import { getImageType, mkdirSync } from '../../utils/file'
import { log } from '../../logs'
import Config from '../../config.json'

/**
 *
 * @param name
 * @param url
 * @param path?
 */
export interface IDownloadImageTypes {
    name: string
    url: string
    path?: string
}

export async function downloadImage(
    data: IDownloadImageTypes,
): Promise<IDownloadedInformation | undefined> {
    if (data.url === undefined) return
    if (data.url === 'filter') return
    if (data.url === '') {
        log('warn', `No such image of file:${data.url}`)
        return
    }
    const path: string = data.path || Config.images.path
    try {
        mkdirSync(path)
    } catch (error) {
        log('error', error)
        return
    }

    const fileType: string | false = getImageType(data.url)
    if (!fileType) {
        log('error', `The image is errored of filename:${data.url}`)
        return
    }

    try {
        const downloadInformation: IDownloadedInformation = await download({
            path,
            name: data.name,
            type: fileType,
            url: data.url,
        })

        return downloadInformation
    } catch (err) {
        log('error', err)
    }
}

export async function downloadImages(
    URLs: Array<IDownloadImageTypes>,
): Promise<Array<IDownloadedInformation | undefined>> {
    if (URLs.length === 0) return []
    const donwloadedInformations: Array<IDownloadedInformation | undefined> = []
    let info: IDownloadedInformation | undefined
    log('success', `Start(${URLs.length})------↓`)
    for (let i = 0; i < URLs.length; i += 1) {
        try {
            info = await downloadImage(URLs[i])
            donwloadedInformations.push(info)
        } catch (error) {
            log('error', `download parameter error:${URLs[i]}`)
        }
    }
    return donwloadedInformations
}
