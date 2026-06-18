export class Signal<T> {
    #value: T;
    #listeners = new Set<() => void>();

    constructor(initial: T) {
        this.#value = initial;
    }

    get value(): T {
        return this.#value;
    }

    set value(next: T) {
        this.#value = next;
        this.#listeners.forEach(fn => fn());
    }

    subscribe(fn: () => void): () => void {
        this.#listeners.add(fn);
        return () => this.#listeners.delete(fn);
    }
}
