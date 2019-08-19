import express from 'express'
import cors from 'cors'
import path from 'path'
import { Mongodb } from '../core/models/mongodb'
import Config from '../config.json'

import subjects from './routes/subjects'
import topic from './routes/topic'
import { log } from '../logs'

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.get('/assets/images/:filename', (req, res) => {
    res.sendFile(path.resolve(Config.images.path, req.params.filename), (req: any, res: any) => {})
})

app.get('/subjects', subjects())
app.get('/subjects/:page', subjects())

app.get('/topics/subject', topic())


app.listen(3000, () => {
    console.log('listening on port 3000!')
})
