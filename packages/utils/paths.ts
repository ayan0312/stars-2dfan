import path from 'path'

const root = path.resolve(__dirname, '../..')
const packages = path.resolve(root, 'packages')
const cli = path.resolve(packages, 'cli')
const core = path.resolve(packages, 'core')
const local = path.resolve(packages, 'local')
const server = path.resolve(packages, 'server')
const shared = path.resolve(packages, 'shared')

export default {
    root,
    packages,
    cli,
    core,
    local,
    server,
    shared,
}
