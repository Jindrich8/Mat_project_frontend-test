import React from "react";


export const useListRange = (options:string[],min?:number|null,max?:number|null) => {
    const [st,setSt] = React.useState<{
        min?:number|null,
        max?:number|null,
        minError?:string,
        maxError?:string
    }
    >({
        min:min,
        max:max,
        minError:undefined,
        maxError:undefined
    });




    const setRange = React.useCallback((type: 'min' | 'max', value: number | undefined,other?:number|null) => {
        setSt(prev => {
            const newState: typeof prev = {
                min: prev.min,
                max: prev.max,
                minError: undefined,
                maxError: undefined
            };
            if(type === 'min'){
                newState.min = value ?? null;
                if(other !== undefined){
                newState.max = other;
                }
            }else{
                newState.max = value ?? null;
                if(other !== undefined){
                newState.min = other;
                }
            }
            if (value !== undefined) {
                if (type === "min") {
                    if ((options[value] ?? undefined) === undefined) {
                        newState.minError = 'Invalid option selected!';
                    }
                    else if (newState.min != null && newState.max != null && newState.min > newState.max) {
                        newState.maxError = 'Max should be greater than or equal to min!';
                    }
                }
                else {
                    if ((options[value] ?? undefined) === undefined) {
                        newState.maxError = 'Invalid option selected!';
                    }
                    else if (newState.min != null && newState.max != null && newState.min > newState.max) {
                        newState.minError = 'Min should be less than or equal to max!';
                    }
                }
            }
            return newState;
        });
    },[options]);

    const setError = React.useCallback((minError?:string|null,maxError?:string|null) => {
        setSt(prev => {
            if(minError !== undefined){
                prev.minError = minError ?? undefined;
            }
            if(maxError !== undefined){
                prev.maxError = maxError ?? undefined;
            }
            return {...prev};
        })
    },[]);

return [st,setRange,setError] as const;
}

export const getListMinMaxError = (options:unknown[],min?: number, max?: number,change?:'min'|'max') => {
    let minError = '';
    let maxError = '';
    if(min !== undefined && max !== undefined){
        if(change === 'min'){
            if((options[min] ?? undefined) === undefined){
                minError = 'Invalid option selected!';
            }
            else if(max < min){
                maxError = 'Max should be greater than or equal to min!';
            }
        }
        else if(change === 'max'){
            if((options[max] ?? undefined) === undefined){
                minError = 'Invalid option selected!';
            }
            else if(max < min){
                maxError = 'Min should be less than or equal to max!';
            }
        }
    }
    return [minError,maxError];
}