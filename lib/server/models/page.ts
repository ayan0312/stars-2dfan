import { getSubjects, getTopics } from './model'
import { Mongodb } from '../../core/mongodb'

export const num = 6

export async function getSubjectsPages(
    find: object,
    page: number,
    num: number,
    sort: number = -1,
): Promise<Array<object> | null> {
    const subjects: Mongodb = await getSubjects()
    const sk = (page - 1) * num
    const data: Array<object> | null = await subjects.db
        .collection(subjects.collectionName)
        .find(find)
        .skip(sk)
        .limit(num)
        .sort({ _id: sort })
        .toArray()
    return data
}

export function withoutPage(){
    
}

export async function getAllPage(): Promise<number> {
    const subjects: Mongodb = await getSubjects()
    return await subjects.db
        .collection(subjects.collectionName)
        .find({})
        .count()
}