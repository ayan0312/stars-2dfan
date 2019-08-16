export function encode(data: string) {
    return Buffer.from(data, 'binary').toString('base64')
}

export function decode(base64str: string) {
    return Buffer.from(base64str, 'base64').toString()
}