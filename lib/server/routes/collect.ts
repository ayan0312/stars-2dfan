import express from 'express'
import { verifyGameName, insertAll } from '../../loadPage/web2dfan/collect'
import loadPage from '../../loadPage/web2dfan'
import { ITotalInformations } from '../../loadPage/data'
import { InsertOneWriteOpResult, ObjectId } from 'mongodb'

export function query() {
    return async (req: express.Request, res: express.Response) => {
        let { URL, remark = '' } = req.body
        console.log(URL)
        try {
            const data: ITotalInformations | void = await loadPage(URL, remark)
            if (data) {
                const verifyData: any = await verifyGameName(data.subject.name)
                if (verifyData) {
                    res.json({
                        code: 200,
                        data: data,
                        tip: 'Repetition',
                    })
                } else {
                    res.json({
                        code: 200,
                        data: data,
                        tip: 'Process',
                    })
                }

            } else {
                return false
            }
        } catch (err) {
            res.json({
                code: 500,
                data: err,
            })
        }
    }
}

export function insert() {
    return async (req: express.Request, res: express.Response) => {
        let { data } = req.body
        if (data) {
            data.subject._id = ObjectId.createFromHexString(data.subject._id)
            data.topic._id = ObjectId.createFromHexString(data.topic._id)
            data.topic.subject_id = ObjectId.createFromHexString(data.topic.subject_id)
            const back: void | InsertOneWriteOpResult = await insertAll(data)
            if (back) {
                res.json({
                    code: 200,
                    data: back
                })
                return
            }

            res.json({
                code: 500,
                data: ''
            })
            return
        }

        res.json({
            code: 500,
            data: ''
        })
    }
}