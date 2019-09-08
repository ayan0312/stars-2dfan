import program from 'commander'

import getURLAnswer from './questions/url'
import getPathAnswer from './questions/path'
import getCookieAnswer from './questions/cookie'

import Config from '../config.json'
import paths from '../utils/paths'
import { writeJSON } from '../utils/file'

program
    .version('1.0.0')
    .option('-C, --Cookie [value]', 'Set Cookie')
    .option('-d, --download [url]', 'Download any images')
    .option('-p, --path [dir]', 'Set images path')
    .option('-s, --start', 'Start')
    .parse(process.argv)

function setCookie() {
    return new Promise((resolve, reject) => {
        if (!program.Cookie) {
            resolve()
            return
        }
        Config.Cookie = program.Cookie
        writeJSON({
            name: 'config.json',
            filepath: paths.packages,
            data: Config,
        })
            .then(() => {
                resolve()
            })
            .catch(error => {
                reject(error)
            })
    })
}

function download() {
    return new Promise((resolve, reject) => {
        if (!program.download) {
            resolve()
            return
        }
        reject()
    })
}

function setPath() {
    return new Promise((resolve, reject) => {
        if (!program.path) {
            resolve()
            return
        }
        Config.images.path = program.path
        writeJSON({
            name: 'config.json',
            filepath: paths.packages,
            data: Config,
        })
            .then(() => {
                resolve()
            })
            .catch(error => {
                reject(error)
            })
    })
}

async function startURL() {
    await getURLAnswer()
    startURL()
}

async function startAnswer() {
    if (Config.Cookie === '') {
        await getCookieAnswer().then((answers: any) => {
            if (answers.filter) {
                Config.Cookie = answers.Cookie
                writeJSON({
                    name: 'config.json',
                    filepath: paths.packages,
                    data: Config,
                })
            }
        })
    }

    if (Config.images.path === '') {
        await getPathAnswer().then((answers: any) => {
            if (answers.filter) {
                Config.images.path = answers.path
                writeJSON({
                    name: 'config.json',
                    filepath: paths.packages,
                    data: Config,
                })
            }
        })
    }

    await startURL()
}

function runner() {
    if (program.start) {
        startURL()
    } else {
        Promise.all([setCookie(), download(), setPath()]).catch(error => {
            console.log(error)
        })
    }
}

runner()
