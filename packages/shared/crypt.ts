import crypto from 'crypto'

export interface ICryptFilename {
    name: string
    timestamp: string
}

export function cryptMd5(md5Code: string) {
    const md5 = crypto.createHash('md5')
    return md5.update(md5Code).digest('hex')
}

export function getMd5Filename(data: ICryptFilename) {
    const md5Name = JSON.stringify({
        name: data.name,
        timestamp: data.timestamp,
    })
    return cryptMd5(md5Name)
}
