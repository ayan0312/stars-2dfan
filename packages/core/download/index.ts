import fs from 'fs'
import request from 'request'
import { log } from '../../logs'

/**
 *
 * @param name
 * @param type
 * @param url
 * @param path
 */
export interface IDownload {
    name: string
    type: string
    url: string
    path: string
}

/**
 *
 * @param name
 * @param type
 * @param filename
 * @param path
 * @param size
 */
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

export function getFileSize(filename: string, callback: (value: string) => void) {
    fs.stat(filename, (error, stats) => {
        if (error) {
            log('error', `get file size error:${filename}`)
            callback('-1')
        } else {
            callback(stats.size.toString())
        }
    })
}
