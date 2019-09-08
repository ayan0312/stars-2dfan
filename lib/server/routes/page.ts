import { getAllPage, num } from '../models/page'
import express from 'express'

async function querySubjects(req: express.Request, res: express.Response) { }

export default function () {
    return async (req: express.Request, res: express.Response) => {
        let pageCount: number = await getAllPage()
        res.json({
            data: {
                count: pageCount,
                num,
            },
            code: '200',
        })
    }
}