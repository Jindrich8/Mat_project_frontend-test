import React, { FC } from "react";
import { ComboboxCmp } from "./components/ComboboxCmp";
import { TxtInputCmp, TxtInputCmpProps } from "./components/TxtInputCmp";
import styles from "../FillInBlanksCmpStyle.module.css"
import { isNotNullNorUndef, strStartAndEndSpacesToNbsp } from "../../../../../utils/utils";
import { TakeContent } from "../FillInBlanks";

type Content = TakeContent;

interface FillInBlanksTakeCmpProps {
    uiData: Content;
    state:{data:(string|number|undefined)[]};
}

const FillInBlanksTakeCmp: FC<FillInBlanksTakeCmpProps> = React.memo(({ uiData,state }) => {

    const onChange = React.useCallback<Exclude<TxtInputCmpProps['onChange'],undefined>>((e) => {
        const value = e.target.value;
        const i = Number(e.target.dataset['index']);
        console.log(`${i}: ${value}`);
        state.data[i] = value;
    }, [state]);

    const onCmbChange = React.useCallback((_value:string,index:number,dataAttr:unknown) =>{
        const i = Number(dataAttr);
        state.data[i] = index;
    },[state])

    let cmpIndex = 0;
    return (
            <span
            className={styles.cmpsContainer}
            style={{display:'inline'}}
            >
            {uiData.map((d,i) => {
                if (typeof d === 'string'){
                    const value = strStartAndEndSpacesToNbsp(d);
                    return <span className={styles.textCmp} key={i}>{value}</span>;
                 } else {
                    const currentCmpIndex = cmpIndex;
                    let cmp;
                    if(d.type === 'cmb'){
                        if((state.data[currentCmpIndex] ?? undefined) === undefined){
                            const emptyIndex = d.values.findIndex(v => v.length === 0);
                            state.data[currentCmpIndex] = emptyIndex >= 0 ? emptyIndex : undefined;
                        }
                        
                      const defaultValue = state.data[currentCmpIndex] ?? undefined;
                        if(isNotNullNorUndef(defaultValue) && typeof defaultValue !== 'number'){
                            throw new Error('Incorrect type of default value');
                        }
                        // avoid rerendering - every render new string instance (cmpIndex.toString()) - pass data attributes to input
                        cmp = <ComboboxCmp
                        className={styles.inputCmp}
                        defaultValue={defaultValue} 
                        key={i}
                        options={d.values} 
                        data-attr={currentCmpIndex}
                        onSelectionChange={onCmbChange} />;
                    }
                    else{
                        state.data[currentCmpIndex] ??="";
                        const defaultValue = state.data[currentCmpIndex];
                        
                        if(isNotNullNorUndef(defaultValue) && typeof defaultValue !== 'string'){
                            throw new Error('Incorrect type of default value');
                        }
                        
                        cmp = <TxtInputCmp 
                        className={styles.inputCmp}
                        defaultValue={defaultValue} 
                        key={i} 
                        data-index={currentCmpIndex}
                        onChange={onChange} />
                    }
                        console.log(`cmpIndex: ${cmpIndex}`);
                    ++cmpIndex;
                    return cmp;
                }

            })}
            </span>
        );
});
FillInBlanksTakeCmp.displayName = 'FillInBlanksTakeCmp';
export { FillInBlanksTakeCmp, type FillInBlanksTakeCmpProps }