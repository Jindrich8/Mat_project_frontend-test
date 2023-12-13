export interface RequestD {
    data: Data;
    [property: string]: any;
}

export interface Data {
    localySavedTask: LocalySavedTask;
}

export interface LocalySavedTask {
    timestamp: Date;
}
