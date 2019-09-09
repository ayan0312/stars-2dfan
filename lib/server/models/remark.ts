import { Mongodb } from '../../core/mongodb'
import { ObjectId } from 'bson'
import { getSubjects } from './model'
import { UpdateWriteOpResult } from 'mongodb'

export async function updateRemark(msg: string, id: ObjectId | string) {
    const subject: Mongodb = await getSubjects()
    const data: UpdateWriteOpResult = await subject.db
        .collection(subject.collectionName)
        .updateOne({
            _id: id,
        }, {
            $set: {
                remark: msg
            }
        })
    return data
}