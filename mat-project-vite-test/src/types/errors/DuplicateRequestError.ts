export class DuplicateRequestError{
    public readonly version:number;

    public constructor(version:number){
        this.version = version;
    }
}