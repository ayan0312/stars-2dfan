import Config from '../config.json'
import { log } from '../logs'
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

function* id() {
    let id = 0
    while (true) {
        if (id >= 256) id = 0
        yield (id += 1)
    }
}

export function verifyURL(URL: string, only: string = ''): boolean {
    if (URL.indexOf(only) === -1) return false
    return true
}

export namespace base64 {
    export function encode(data: string) {
        return Buffer.from(data, 'binary').toString('base64')
    }

    export function decode(base64str: string) {
        return Buffer.from(base64str, 'base64').toString()
    }
}

export function filter2DFanImageURL(URL: string): string | false {
    if (!verifyURL(URL, 'img.2dfan.com')) return false
    if (Config.download.filters) {
        let isFilter = false
        Config.download.filters.some((value: string) => {
            if (URL.indexOf(value) !== -1) {
                isFilter = true
                return true
            }
        })
        if (isFilter) return 'filter'
    }
    if (URL.indexOf('?') === -1) return URL
    if (URL.indexOf('?imageMogr') !== -1) return URL.split('?imageMogr')[0]
    return URL.split('?')[0]
}

export function verify2DFan(URL: string) {
    if (!verifyURL(URL, '2dfan.com')) {
        log('error', `This url is typed error:${URL}`)
        return false
    }
    return true
}

export function merge(target: any, obj: any) {
    const deep: any = {}
    Object.keys(target).forEach((value: string) => (deep[value] = target[value]))
    Object.keys(deep).forEach((value: string) => {
        if (obj[value] !== undefined) {
            deep[value] = obj[value]
        }
    })
    return deep
}

export function format(formatString: string, timestamp: number) {
    let fmt: string = formatString
    const date = new Date(timestamp)
    const o: any = {
        'y+': date.getFullYear(),
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
        'H+': date.getHours(),
        'm+': date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(),
        's+': date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
            )
        }
    }
    return fmt
}

export function getURLRouter(URL: string, near?: string): string {
    let url: string = ''
    if (URL.indexOf('?') !== -1) {
        url = URL.split('?')[0]
    } else {
        url = URL
    }
    if (url.indexOf('/') === -1) return url
    const urls = url.split('/')
    let stopEach: boolean = false
    let router: string = ''
    if (near !== undefined) {
        urls.some((value: string) => {
            if (stopEach) {
                router = value
                return true
            }
            if (near === value) {
                stopEach = true
            }
        })
    } else {
        router = urls.pop() || ''
    }
    return router
}

/**
 * async delay
 * @param delayMinMS
 * @param delayMaxMS
 */
export async function delay(delayMinMS: number = 200, delayMaxMS: number = 500): Promise<void> {
    const num = delayMaxMS - delayMinMS
    const ms = Math.round(Math.random() * num) + delayMinMS
    await setTimeout(() => { }, ms)
}
