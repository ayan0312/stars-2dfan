import chalk from 'chalk'
import { errorLogger, warnLogger } from './log4js'

namespace logs {
    export function success(info: string) {
        const type: string = '√'
        console.log(`${chalk.green.bold(type)} ${chalk.green(info)}`)
    }

    export function warn(info: string) {
        warnLogger.warn(info)
    }

    export function error(info: string) {
        errorLogger.error(info)
    }

    export function fatal(info: string) {
        errorLogger.error(info)
    }
}

export function log(type: string, data: any) {
    switch (type) {
        case 'success':
            logs.success(data)
            break
        case 'warn':
            logs.warn(data)
            break
        case 'error':
            logs.error(data)
            break
        case 'fatal':
            logs.fatal(data)
            break
    }
}

export interface ILogStatsOptions {
    name: string
    data: any
    tip: string
}

export function logStats(options: ILogStatsOptions): void {
    let log: string = ''
    const logs1: Array<string> = []
    const logs2: Array<string> = []
    logs1.length = 30 - options.name.length - options.tip.length - 2
    logs2.length = 30

    const startLog = chalk.green.bold(`┏ ${options.name} ${options.tip} ${logs1.join('-')}`)

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

    const endLog = `${log}${chalk.green.bold(`┗ ${logs2.join('-')}`)}\n`
    console.log(endLog)
}
