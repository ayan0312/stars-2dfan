import { findTopic } from '../models/find'
import express from 'express'
import { ObjectId } from 'bson'

export default function () {
    return async (req: express.Request, res: express.Response) => {
        let subjectid: string = req.query.id
        if (!subjectid) {
            res.json({
                data: null,
                code: 404
            })
            return
        }
        
        let _id: ObjectId | string = ''
        try {
            _id = ObjectId.createFromHexString(subjectid)
        } catch (err) {
            _id = subjectid
        }

        const data: Array<any> | null = await findTopic(_id)
        if (data) {
            let html = data[0].html
            let arr: Array<any> = []
            Object.keys(html).forEach((value, index) => {
                arr = arr.concat(html[value].content)
            })
            let string = arr.join('').trim()
            res.json({
                code: 200,
                data: string
            })
        }
    }
}
