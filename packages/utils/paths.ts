import path from 'path'

const root = path.resolve(__dirname, '../..')
const packages = path.resolve(root, 'packages')
const cli = path.resolve(packages, 'cli')
const core = path.resolve(packages, 'core')
const log = path.resolve(packages, 'log')
const server = path.resolve(packages, 'server')
const shared = path.resolve(packages, 'shared')

export default {
    root,
    packages,
    cli,
    core,
    log,
    server,
    shared,
}
