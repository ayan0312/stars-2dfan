import { Mongodb } from '../../core/mongodb'

import { format, merge } from '../../utils'
import { ObjectId } from 'bson'

export async function getSubjects() {
    return await Mongodb.connection('subjects')
}

export async function getTopics() {
    return await Mongodb.connection('topics')
}

function mergeId(id: string) {
    let timestamp: number = new Date().getTime()
    let rule = {
        _id: ObjectId.createFromTime(timestamp),
        subjects_id: id
    }
    return rule
}

async function updateSubject(target: any, update: any) {
    const subjects: Mongodb = await getSubjects()
    await subjects.db
        .collection(subjects.collectionName)
        .updateOne(target,{
            $set:update
        })
}