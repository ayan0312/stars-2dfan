import fs from 'fs'
import path from 'path'

export interface IReadJSON {
    name: string
    filepath: string
}

export interface IWriteJSON {
    name: string
    filepath: string
    data: object
}

export function getImageType(URL: string): string | false {
    const types: Array<string> = ['png', 'jpg', 'gif', 'bmp', 'webp']
    let type: string = ''
    let prevTypeIndex: number = 0
    types.forEach((value: string) => {
        const lastIndex = URL.lastIndexOf(`.${value}`)
        if (lastIndex !== -1) {
            if (lastIndex > prevTypeIndex) {
                prevTypeIndex = lastIndex
                type = value
            }
        }
    })
    if (prevTypeIndex === 0) return false
    return type
}

export function readJSON(data: IReadJSON) {
    return new Promise((resolve, reject) => {
        let { name } = data
        if (name.indexOf('.json') === -1) name += '.json'
        fs.readFile(path.resolve(data.filepath, name), 'utf8', (err, data) => {
            if (err) reject(err)
            resolve(JSON.parse(data))
        })
    })
}

export function writeJSON(writeData: IWriteJSON) {
    return new Promise((resolve, reject) => {
        let { name } = writeData
        if (name.indexOf('.json') === -1) name += '.json'
        fs.writeFile(
            path.resolve(writeData.filepath, name),
            JSON.stringify(writeData.data),
            'utf8',
            err => {
                if (err) reject(err)
                resolve(true)
            },
        )
    })
}
