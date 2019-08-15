export default class Stack<T> {
    private items: Array<T>

    public constructor() {
        this.items = []
    }

    public push(element: T): void {
        this.items.push(element)
    }

    public pop(): T | undefined {
        return this.items.pop()
    }

    public peek(): T {
        return this.items[this.items.length - 1]
    }

    public size(): number {
        return this.items.length
    }

    public isEmpty(): boolean {
        return this.items.length === 0
    }

    public clear(): void {
        this.items = []
    }

    public print(): void {
        console.log(this.items.toString())
    }
}
