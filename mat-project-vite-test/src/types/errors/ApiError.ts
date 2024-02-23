export class ApiError<T>{
    public error: T|undefined;
    public status:number;
    public statusText:string;

    public constructor({error,status,statusText}:{error:T|undefined,status:number,statusText:string}){
        this.error = error;
        this.status = status;
        this.statusText = statusText;
    }
}