import { AxiosError, AxiosResponse } from "axios";
import { ErrorWData } from "../errors/ErrorWData";
import { Any } from "../types";
import { EndpointResponse, ErrorDetail } from "./apiTypes";
import { ErrorResponseType } from "./errorResponseType";
import { SuccessResponseType } from "./successResponseType";

type Func<T> = (value: T) => void;

type Callbacks = {
    error?: Record<PropertyKey, Func<unknown>>,
    axiosError?: Record<PropertyKey, Func<AxiosError<ErrorResponseType<ErrorDetail> | undefined, Any>>>,
    serverError?: Record<PropertyKey, Func<AxiosResponse<ErrorResponseType<ErrorDetail> | undefined, Any>>>,
    success?: Record<PropertyKey, Func<AxiosResponse<SuccessResponseType<EndpointResponse>, Any>>>,
};
// AxiosResponse<SuccessResponseType<EndpointResponse>, Any>
//  AxiosResponse<ErrorResponseType<ErrorDetail> | undefined, Any>
//  AxiosError<ErrorResponseType<ErrorDetail> | undefined, Any>
type RecordValue<Rec extends Record<PropertyKey, unknown>> = Rec extends Record<PropertyKey, infer T> ? T : never;

export class ApiController {
    private controller: AbortController | undefined;
    private data: Record<PropertyKey, unknown>;
    private beforeAbortSync: ((controller: ApiController) => void) | undefined;
    private isInBeforeAbortSync: boolean;
    private callbacks?: Callbacks;

    public constructor() {
        this.controller = undefined;
        this.data = {};
        this.beforeAbortSync = undefined;
        this.isInBeforeAbortSync = false;
        this.callbacks = undefined;
    }

    public setCallback<Type extends keyof Callbacks>(type: Type, key: PropertyKey, callback: RecordValue<Exclude<Callbacks[Type], undefined>>): void {
        const rec = {} as Exclude<Callbacks[Type], undefined>;
        const callbacks = this.callbacks ??= {};
        const dict = callbacks[type] ??= rec;
       dict[key] = callback;
    }

    public removeCallback<Type extends keyof Callbacks>(type: Type,key: PropertyKey): void {
        const callbacks = this.callbacks;
        if(callbacks){
            const dict =  callbacks[type] ?? undefined;
            if(dict !== undefined){
                delete dict[key];
            }
        }
    }

    public call<Type extends keyof Callbacks>(type: Type,arg:Parameters<RecordValue<Exclude<Callbacks[Type], undefined>>>[0]){
        const callbacks = this.callbacks;
        if(callbacks){
            const dict = callbacks[type] ?? undefined;
            if(dict !== undefined){
                const dict2 = dict as Record<PropertyKey,Func<typeof arg>>;
                for(const key of Reflect.ownKeys(dict2)){
                    dict2[key](arg);
                }
            }
        }
    }

    public set(beforeAbortSync: typeof this.beforeAbortSync = undefined): AbortSignal | undefined {
        this.controller = new AbortController();
        this.beforeAbortSync = beforeAbortSync;
        return this.controller.signal;
    }

    public abort(reason: NonNullable<unknown>): void {
        if (this.isInBeforeAbortSync) {
            throw new ErrorWData(
                "Could not call abort in beforeAbortSync callback, this is probably bug, that could lead to infinite cycle",
                { controller: this, dataCopy: { ...this.data } }
            );
        }
        if (this.beforeAbortSync) {
            try {
                this.isInBeforeAbortSync = true;
                (this.beforeAbortSync)(this);
            }
            finally {
                this.isInBeforeAbortSync = false;
            }
        }
        this.controller?.abort(reason);
    }

    public setData(key: PropertyKey, value: unknown): void {
        this.data[key] = value;
    }

    public getData(key: PropertyKey): { exists: true, value: unknown } | { exists: false } {
        return Object.hasOwn(this.data, key) ?
            { exists: true, value: this.data[key] }
            : { exists: false };
    }
}


type GetFunctionsFromCallbacks<T extends Record<PropertyKey,Record<PropertyKey,unknown>>> = {
    [key in keyof T]: RecordValue<T[key]>;
};

type ApiControllerCallbacks = GetFunctionsFromCallbacks<Callbacks>;

export {type ApiControllerCallbacks};