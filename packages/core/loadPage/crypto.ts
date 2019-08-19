import crypto from 'crypto'

export function cryptMd5(md5Code: string) {
    const md5: crypto.Hash = crypto.createHash('md5')
    return md5.update(md5Code).digest('hex')
}

export function getMd5Name(name: string, timestamp: string) {
    const md5Name: string = JSON.stringify({
        name,
        timestamp,
    })
    return cryptMd5(md5Name)
}
