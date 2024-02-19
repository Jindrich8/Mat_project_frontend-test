export type Response<T,E> = {
    success:true,
    body:T;
} | {
    success:false,
    status:number;
    statusText:string;
    error:E;
}