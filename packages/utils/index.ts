import Config from '../config.json'
import { tip } from './logs'

const URLReg: RegExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

export function verifyURL(URL: string, only: string = ''): boolean {
    if (!URLReg.test(URL)) return false
    if (URL.indexOf(only) === -1) return false
    return true
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
        tip(`This url is typed error`, 'error')
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

export function format(formatString: string) {
    let fmt = formatString
    const date = new Date()
    const o: any = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
    }
    const week: any = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d',
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') +
                week[`${date.getDay()}`],
        )
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
    await setTimeout(() => {}, ms)
}
