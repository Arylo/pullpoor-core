export interface ICatch {
    latestUpdatedAt: number;
    nextUpdatedAt: number;
    hashes: {
        [hash: string]: number;
    };
}

export interface ICatchMap {
    [name: string]: ICatch;
}

export interface INotes extends ICatch {
    notes: string[];
    length: number;
}
