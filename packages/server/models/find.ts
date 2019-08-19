import { getSubjects, getTopics } from './model'
import { Mongodb } from '../../core/models/mongodb'

export async function findSubjects(name: string): Promise<Array<object> | null> {
    const subjects: Mongodb = await getSubjects()
    const query: object = {
        name: new RegExp(name),
    }
    const data: Array<object> | null = await subjects.find(query)
    return data
}

export async function findTopic(subjectId: string): Promise<Array<object> | null> {
    const topic: Mongodb = await getTopics()
    const data: Array<object> | null = await topic.db
        .collection(topic.collectionName)
        .find({
            subject_id: subjectId,
        })
        .toArray()
    return data
}
