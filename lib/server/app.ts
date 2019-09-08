import express from 'express'
import cors from 'cors'
import path from 'path'

import subjects from './routes/subjects'
import topic from './routes/topic'
import allpage from './routes/page'
import find from './routes/find'
import images from './routes/images'

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.get('/assets/images/?:filename', images())

app.get('/subjects', subjects())
app.get('/subjects/:page', subjects())

app.get('/topic/subject', topic())

app.get('/find/search', find())

app.get('/find/brand/:value', find('brand'))
app.get('/find/painter/:value', find('painter'))
app.get('/find/voiceActor/:value', find('voiceActor'))
app.get('/find/scriptwriter/:value', find('scriptwriter'))
app.get('/find/musician/:value', find('musician'))
app.get('/find/singer/:value', find('singer'))
app.get('/find/type/:value', find('type'))

app.get('/allpage', allpage())


app.listen(3000, () => {
    console.log('listening on port 3000!')
})
