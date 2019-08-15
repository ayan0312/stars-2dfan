export function merge(target: any, obj: any) {
    const deep: any = {}
    Object.keys(target).forEach((value: string) => (deep[value] = target[value]))
    Object.keys(deep).forEach((value: string) => {
        if (obj[value] !== undefined) {
            deep[value] = obj[value]
        }
    })
    return deep
}
