import {RequestAbortError } from "../errors/RequestAbortError";
import { OldRequestError } from "../errors/OldRequestError";

export type Response<T,E> =
{
    success:true;
    body:T;
} | ({
    success:false;
} & (
   { 
    isServerError:true;
    status:number;
    statusText:string;
    error:E;
   }
   |{
    isServerError:false;
    error:RequestAbortError|OldRequestError;
})
   );
