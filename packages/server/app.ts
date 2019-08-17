import express from 'express'
import Galgame from '../core/models/galgame'
import cors from 'cors'
import path from 'path'
import * as Base64 from '../utils/base64'
import { loadPage } from '../core/loadPage'
import { IGameInformation } from '../core/data'
import { writeJSON } from '../shared/file'
import paths from '../utils/paths'
import Config from '../config.json'

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.get('/stars', cors(), (req, res) => {
    const { url, saveType, saveTopic, remark, path } = req.query
    Config.images.path = path
    writeJSON({
        name: 'config.json',
        filepath: paths.packages,
        data: Config,
    })

    loadPage(
        url,
        (data: IGameInformation) => {
            res.json(data)
        },
        { remark },
    )
})

app.get('/path', (req, res) => {
    res.json({
        path: Config.images.path,
    })
})

app.get('/galgame', async (req, res, next) => {
    if (!req.query.data) {
        res.json({
            error_code: '404',
        })
        return
    }
    const findType: object = JSON.parse(Base64.decode(req.query.data))

    const db: any = await Galgame.connect()
    const galgame: Galgame = new Galgame(db, 'subject')
    try {
        const data = await galgame.find(findType)
        res.json({
            data,
            error_code: '200',
        })
    } catch (err) {
        res.json({
            error_code: '300',
        })
    }
})
app.listen(3000, () => {
    console.log('listening on port 3000!')
})
