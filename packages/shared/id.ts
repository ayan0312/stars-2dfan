function* id() {
    let id = 0
    while (true) {
        if (id >= 256) id = 0
        yield (id += 1)
    }
}
const getId = id()
export function cId() {
    const timestamp: string = new Date().getTime().toString()
    const iteratorNumber: number = getId.next().value
    return `${timestamp}&${iteratorNumber}`
}
