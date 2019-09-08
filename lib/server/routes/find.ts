import { findTypes } from '../models/find'
import express from 'express'

export default function (type?: string) {
    return async (req: express.Request, res: express.Response) => {
        let data: Array<object> | null
        if (type) {
            let query = { [type]: '' }
            if (req.params.value) query[type] = req.params.value
            data = await findTypes(query)
            res.json({
                code: 200,
                data,
            })
            return
        }

        data = await findTypes(req.query)
        res.json({
            code: 200,
            data,
        })
    }
}
