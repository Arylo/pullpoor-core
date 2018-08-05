export interface IStore {
    notes: {
        [note: string]: number;
    };
    book: {
        [date: string]: string[];
    };
}

export interface IStoreMap {
    [name: string]: IStore;
}
