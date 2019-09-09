import { getSubjects, getTopics } from './model'
import { Mongodb } from '../../core/mongodb'

export const num = 6

export async function getSubjectsPages(
    find: object,
    page: number,
    num: number,
    sort: number = -1,
): Promise<Array<object> | null> {
    let pageCount: number = await getAllPage()
    let thePage = page
    if (sort === -1) {
        thePage = Math.ceil(pageCount / num) - thePage + 1
    }

    const subjects: Mongodb = await getSubjects()
    const sk = (thePage - 1) * num
    const data: Array<object> | null = await subjects.db
        .collection(subjects.collectionName)
        .find(find)
        .skip(sk)
        .limit(num)
        .toArray()
    return data
}

export async function getAllPage(): Promise<number> {
    const subjects: Mongodb = await getSubjects()
    return await subjects.db
        .collection(subjects.collectionName)
        .find({})
        .count()
}