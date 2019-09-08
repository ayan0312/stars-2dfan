import fs from 'fs'
import request from 'request'
import { log } from '../logs'
import { getImageType, mkdirSync } from '../utils/file'
import Config from '../config.json'

export interface IDownload {
    name: string
    type: string
    url: string
    path: string
}

export interface IDownloadedInformation {
    name: string
    type: string
    filename: string
    path: string
    size?: string
}

export function download(data: IDownload): Promise<IDownloadedInformation> {
    return new Promise((resolve, reject) => {
        const { url, name, type } = data
        let { path } = data
        if (path.lastIndexOf('/') !== path.length - 1) {
            path = `${path}/`
        }
        const writeStream: fs.WriteStream = fs.createWriteStream(`${path}${name}.${type}`)
        const readStream: request.Request = request.get(url)
        readStream.pipe(writeStream)

        readStream.on('error', err => {
            reject(`Download error:${err}`)
        })

        writeStream.on('finish', () => {
            log('success', `${name}.${type}`)
            writeStream.end()
            const filename: string = `${path}${name}.${type}`
            getFileSize(filename, (size: string) => {
                resolve({
                    path,
                    name,
                    type,
                    size,
                    filename,
                })
            })
        })
    })
}

function getFileSize(filename: string, callback: (value: string) => void) {
    fs.stat(filename, (error, stats) => {
        if (error) {
            log('error', `get file size error:${filename}`)
            callback('-1')
        } else {
            callback(stats.size.toString())
        }
    })
}

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