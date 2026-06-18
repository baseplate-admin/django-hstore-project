export class Signal<T> {
    #value: T;
    #subscribers = new Set<(value: T) => void>();

    constructor(initial: T) {
        this.#value = initial;
    }

    get value(): T {
        return this.#value;
    }

    set value(next: T) {
        this.#value = next;
        this.#subscribers.forEach(fn => fn(this.#value));
    }

    subscribe(run: (value: T) => void): () => void {
        this.#subscribers.add(run);
        run(this.#value);

        return () => {
            this.#subscribers.delete(run);
        };
    }
}
