import fs from 'fs'
import request from 'request'
import { tip } from '../../utils/logs'

export interface IDownload {
    url: string
    filename: string
    path: string
}

export interface IDownloadedInformation {
    filename: string
    path: string
}

export function download(data: IDownload): Promise<IDownloadedInformation> {
    return new Promise((resolve, reject) => {
        const { url, filename } = data
        let { path } = data
        if (path.lastIndexOf('/') !== path.length - 1) {
            path = `${path}/`
        }

        const writeStream: fs.WriteStream = fs.createWriteStream(`${path}${filename}`)
        const readStream: request.Request = request.get(url)
        readStream.pipe(writeStream)

        readStream.on('end', () => {
            tip(`${filename} ↓`, 'success')
            tip('The file has been downloaded', 'success')
        })

        readStream.on('error', err => {
            reject(`Download error:${err}`)
        })

        writeStream.on('finish', () => {
            tip('The file has been written', 'success')
            writeStream.end()
            resolve({
                filename,
                path,
            })
        })
    })
}

export function mkdirSync(dirname: string): boolean {
    if (dirname === '') {
        throw `No such file or directory:${dirname}`
    }
    if (fs.existsSync(dirname)) {
        return true
    }
    fs.mkdirSync(dirname)
    return true
}
