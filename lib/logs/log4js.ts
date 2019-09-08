import log4js from 'log4js'

log4js.configure({
    appenders: {
        stdout: {
            type: 'stdout',
        },
        error: {
            type: 'dateFile',
            filename: 'error_log/error',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
        },
    },
    categories: {
        default: {
            appenders: ['stdout'],
            level: 'warn',
        },
        error: {
            appenders: ['stdout', 'error'],
            level: 'error',
        },
    },
})

function getLogger(name?: string) {
    return log4js.getLogger(name || 'default')
}

export let errorLogger = getLogger('error')
export let warnLogger = getLogger('warn')
