export class ApiController{
    private controller:AbortController|undefined;
    
    public constructor(){
        this.controller = undefined;
    }

    public set():AbortSignal|undefined{
         this.controller = new AbortController();
         return this.controller.signal;
    }

    public abort(reason:NonNullable<unknown>):void{
        this.controller?.abort(reason);
    }
}