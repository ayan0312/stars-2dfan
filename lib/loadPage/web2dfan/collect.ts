import { Mongodb } from '../../core/mongodb'
import { ITotalInformations } from '../../loadPage/data'
import { InsertOneWriteOpResult } from 'mongodb'

export async function verifyGameName(name: string): Promise<any | void> {
    const subjects: Mongodb = await Mongodb.connection('subjects')
    const getData: any = await subjects.find({
        name
    })
    if (getData[0] instanceof Array) return
    if (typeof getData[0] !== 'object') return
    if ('name' in getData[0]) {
        if (getData[0].name === name) {
            return getData[0]
        }
    }
}

export async function insertAll(data: ITotalInformations): Promise<InsertOneWriteOpResult | void> {
    if (data === undefined) return
    const { subject, topic } = data
    const subjects: Mongodb = await Mongodb.connection('subjects')
    subjects.insert(subject)
    if (!topic) return
    const topics: Mongodb = await Mongodb.connection('topics')
    return topics.insert(topic)
}