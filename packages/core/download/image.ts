import { download, mkdirSync, IDownloadedInformation } from './index'
import { getImageType } from '../../shared/file'
import { getMd5Filename } from '../../shared/crypt'
import { tip } from '../../shared/logs'

export interface IDownloadImageTypes {
    name: string
    url: string
    path: string
    timestamp: string
}

export function downloadImage(data: IDownloadImageTypes): Promise<IDownloadedInformation> {
    return new Promise(async (resolve, reject) => {
        if (data.url === 'filter') {
            resolve()
            return
        }
        if (data.url === '') {
            tip(`No such file:${data.url}`, 'warn')
            resolve()
            return
        }

        const fileType = getImageType(data.url)
        if (!fileType) {
            reject(`This URL is typed error of filename:${data.url}`)
            return
        }

        const filename = getMd5Filename({
            name: data.name,
            timestamp: data.timestamp,
        })

        if (mkdirSync(data.path)) {
            try {
                const downloadInformation: IDownloadedInformation = await download({
                    filename: `${filename}.${fileType}`,
                    url: data.url,
                    path: data.path,
                })

                resolve(downloadInformation)
            } catch (err) {
                tip(err, 'error')
                resolve()
                return
            }
        }
    })
}

export function downloadImages(URL: Array<IDownloadImageTypes>): void {
    if (URL.length === 0) return
    URL.forEach((value: IDownloadImageTypes) => {
        downloadImage(value)
    })
}
