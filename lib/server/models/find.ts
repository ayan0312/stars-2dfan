import { getSubjects, getTopics } from './model'
import { Mongodb } from '../../core/mongodb'
import { ObjectId } from 'bson';

export async function findSubjects(name: string): Promise<Array<object> | null> {
    const subjects: Mongodb = await getSubjects()
    const query: object = {
        name: new RegExp(name),
    }
    const data: Array<object> | null = await subjects.find(query)
    return data
}

export interface IFindTypes {
    name?: string
    anotherName?: string
    brand?: Array<string>
    painter?: Array<string>
    voiceActor?: Array<string>
    scriptwriter?: Array<string>
    musician?: Array<string>
    singer?: Array<string>
    type?: Array<string>
}

export async function findTypes(types: IFindTypes = {}): Promise<Array<object> | null> {
    const subjects: Mongodb = await getSubjects()
    const query: object = types
    const data: Array<object> | null = await subjects.find(query)
    return data
}

export async function findTopic(subjectId: ObjectId | string): Promise<Array<object> | null> {
    const topic: Mongodb = await getTopics()
    const data: Array<object> | null = await topic.db
        .collection(topic.collectionName)
        .find({
            subject_id: subjectId,
        })
        .toArray()
    return data
}
