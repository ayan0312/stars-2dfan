import { getSubjectsPages, num, getAllPage } from '../models/page'
import express from 'express'

export default function (find: object = {}, sort: number = -1) {
    return async (req: express.Request, res: express.Response) => {
        let page: number | string = req.params.page || 1
        if (typeof page !== 'number') page = parseInt(page, 10)

        const data: Array<object> | null = await getSubjectsPages(find, page, num, sort)
        res.json({
            data,
            code: '200',
        })
    }
}