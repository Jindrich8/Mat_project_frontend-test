import { AbortError } from "./AbortError";

export class RequestAbortError extends AbortError{
    public readonly reason:unknown;

    public constructor(reason:unknown){
        super();
        this.reason = reason;
    }
}