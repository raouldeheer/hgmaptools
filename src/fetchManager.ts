import EventEmitter from "events";

export default class FetchManager extends EventEmitter {
    cache: Map<string, unknown>;
    inTransit: Set<string>;

    constructor() {
        super();
        this.cache = new Map();
        this.inTransit = new Set();
    }

    async fetch<T>(endpoint: string): Promise<T | null> {
        if (this.cache.has(endpoint)) {
            return this.cache.get(endpoint) as T;
        } else if (this.inTransit.has(endpoint)) {
            return new Promise(res => this.once(endpoint, res));
        } else {
            try {
                this.inTransit.add(endpoint);
                const data = await fetch(endpoint).then(data => data.json());
                this.cache.set(endpoint, data);
                this.emit(endpoint, data);
                this.inTransit.delete(endpoint);
                return data;
            } catch (error) {
                console.error(error);
            }
        }
        return null;
    }
}
