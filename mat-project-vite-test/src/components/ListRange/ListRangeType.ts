import React from "react";


export const useListRange = (options:string[],min?:number|null,max?:number|null) => {
    const [st,setSt] = React.useState<{
        min?:number|null,
        max?:number|null,
        lastChange?:"min"|"max"
    }
    >({
        min:min,
        max:max,
    });

    const errors = React.useMemo(() => {
        const newErrors: {
            minError?: string,
            maxError?: string
        } = {};
        const { min, max, lastChange } = st;
        if (lastChange === "min") {
            if (min != null) {
                if ((options[min] ?? undefined) === undefined) {
                    newErrors.minError = 'Invalid option selected!';
                }
                else if (max != null && min > max) {
                    newErrors.maxError = 'Max should be greater than or equal to min!';
                }
            }
        }
        else {
            if (max != null) {
                if ((options[max] ?? undefined) === undefined) {
                    newErrors.maxError = 'Invalid option selected!';
                }
                else if (min != null && min > max) {
                    newErrors.minError = 'Min should be less than or equal to max!';
                }
            }
        }
        return newErrors;
    }, [options, st]);




    const setRange = React.useCallback((type: 'min' | 'max', value: number | undefined,other?:number|null) => {
        setSt(prev => {
            const newState: typeof prev = {
                min: prev.min,
                max: prev.max
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
            return newState;
        });
    },[]);

return [st,errors,setRange] as const;
}
