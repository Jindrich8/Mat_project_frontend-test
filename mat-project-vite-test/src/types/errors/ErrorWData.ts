export class ErrorWData<T> extends Error{
    private readonly data:T;
    public constructor(message:string,data:T,options:ErrorOptions|undefined = undefined){
        super(message,options);
        this.data = data;
    }

    public getData():T{
        return this.data;
    }
}