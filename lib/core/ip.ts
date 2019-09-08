import request from 'request'
import iconv from 'iconv-lite'
import { log } from '../logs'

const apiURL =
    'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1'

function getProxyList() {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: apiURL,
            gzip: true,
            encoding: null,
            headers: {
                Accept:
                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
                'User-Agent':
                    'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                referer: 'http://www.66ip.cn/',
            },
        }
        request(options, (error: any, response: request.Response, body: any) => {
            if (error) {
                throw error
            }

            let debody: any = body
            if (/meta.*charset=gb2312/.test(debody)) {
                debody = iconv.decode(debody, 'gbk')
            }
            const ret: Array<string> = debody.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g)
            resolve(ret)
        })
    })
}

getProxyList()
    .then((proxyList: any) => {
        const targetOptions = {
            method: 'GET',
            url: 'http://ip.chinaz.com/getip.aspx',
            timeout: 8000,
            encoding: null,
            proxy: '',
        }
        proxyList.forEach((proxyurl: string) => {
            log('success',`getting ${proxyurl}`)
            /**
            request(targetOptions, (error: any, response: request.Response, body: any) => {
                try {
                    if (error) throw error
                    let bodyString = body.toString()
                    console.log(bodyString)
                    const ret = bodyString
                    if (ret.address) {
                        log('success', `${ret.address}`)
                    }
                } catch (error) {
                    log('error', error)
                }
            })
             */
        })
    })
    .catch(error => {
        log('error', error)
    })
