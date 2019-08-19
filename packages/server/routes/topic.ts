import { findTopic } from '../models/find'
import express from 'express'

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
        const data: Array<any> | null = await findTopic(subjectid)
        if (data) {
            let html = data[0].html
            let arr: Array<any> = []
            Object.keys(html).forEach((value, index) => {
                arr = arr.concat(html[value].content)
            })
            let string = arr.join('')
            res.send(string)
        }
    }
}
