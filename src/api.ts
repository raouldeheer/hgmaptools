export function createApiFetch(api: string) {
    const cache = new Map<string, unknown>();
    const inTransit = new Set<string>();
    const waiting = new Map<string, ((data: any) => void)[]>();

    return async <T>(endpoint: string): Promise<T | null> => {
        if (cache.has(endpoint)) {
            return cache.get(endpoint) as T;
        } else if (inTransit.has(endpoint)) {
            return Promise.race([
                new Promise<T>(res => {
                    const waitingList = waiting.get(endpoint) || [];
                    waitingList.push(res);
                    waiting.set(endpoint, waitingList);
                }),
                new Promise<null>(res =>
                    setTimeout(() => {
                        res(null);
                    }, 2000),
                ),
            ]);
        } else {
            try {
                inTransit.add(endpoint);
                const data = await fetch(api + endpoint).then(data =>
                    data.json(),
                );
                cache.set(endpoint, data);
                waiting.get(endpoint)?.forEach(res => res(data));
                inTransit.delete(endpoint);
                return data;
            } catch (error) {
                console.error(error);
            }
        }
        return null;
    };
}
