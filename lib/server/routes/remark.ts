import { updateRemark } from '../models/remark'
import express from 'express'
import { ObjectId } from 'bson'

export default function () {
    return async (req: express.Request, res: express.Response) => {
        let { message, id } = req.body
        let _id: ObjectId | string = ''
        try {
            _id = ObjectId.createFromHexString(id)
        } catch (err) {
            _id = id
        }

        var result = await updateRemark(message, _id)
        res.json({
            code: 200,
            data: result,
        })
    }
}
