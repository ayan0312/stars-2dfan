import express from 'express'
import path from 'path'
import Config from '../../config.json'

export default function() {
    return (req: express.Request, res: express.Response) => {
        res.sendFile(path.resolve(Config.images.path, req.params.filename), (req: any, res: any) => {})
    }
}
