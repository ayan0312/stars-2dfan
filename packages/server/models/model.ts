import { Mongodb } from '../../core/models/mongodb'

export async function getSubjects() {
    return await Mongodb.connection('subjects')
}

export async function getTopics() {
    return await Mongodb.connection('topics')
}
