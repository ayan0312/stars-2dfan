import chalk, { Chalk } from 'chalk'

function typeColor(type: string = 'success') {
    let chalkType: Chalk = chalk.green
    let char: string = '√'
    switch (type) {
        case 'error':
            char = '×'
            chalkType = chalk.red
            break
        case 'success':
            char = '√'
            chalkType = chalk.green
            break
        case 'warn':
            char = '!'
            chalkType = chalk.yellow
            break
    }

    return {
        char,
        color: chalkType,
    }
}

export interface ILogStatsOptions {
    name: string
    data: any
    tip: string
    type: string
}

export function tip(data: any, type: string) {
    const types = typeColor(type)

    let log: string = ''
    if (typeof data === 'string') {
        log += `${types.color.bold(types.char)} ${types.color(data)}`
    } else {
        log += data
    }

    console.log(log)
}

export function logStats(options: ILogStatsOptions): void {
    const types = typeColor(options.type)

    let log: string = ''
    const logs1: Array<string> = []
    const logs2: Array<string> = []
    logs1.length = 30 - options.name.length - options.tip.length - 2
    logs2.length = 30

    const startLog = types.color.bold(`┏ ${options.name} ${options.tip} ${logs1.join('-')}`)

    console.log(startLog)
    if (typeof options.data !== 'object') {
        options.data.split('\n').forEach((line: string) => {
            log += `  ${chalk.yellow.white.bold(line)}\n`
        })
    } else {
        Object.keys(options.data).map((val, index) => {
            log += `  ${val}:${options.data[val]}\n`
        })
    }

    const endLog = `${log}${types.color.bold(`┗ ${logs2.join('-')}`)}\n`
    console.log(endLog)
}
