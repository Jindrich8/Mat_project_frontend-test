import React, { FC } from "react";
import { ComboboxCmp } from "./components/ComboboxCmp";
import { TxtInputCmp } from "./components/TxtInputCmp";
import { Group } from "@mantine/core";
import styles from "../FillInBlanksCmpStyle.module.css"
import { isNotNullNorUndef } from "../../../../../utils/utils";
import { TakeContent } from "../FillInBlanks";


type Content = TakeContent;

interface FillInBlanksTakeCmpProps {
    uiData: Content;
    state:{data:(string|number|undefined)[]};
}

const FillInBlanksTakeCmp: FC<FillInBlanksTakeCmpProps> = React.memo(({ uiData,state }) => {

    const onChange = React.useCallback((value:string|number|undefined,i:number) => {
        console.log(`${i}: ${value}`);
        state.data[i] = value;
    }, [state]);

    let cmpIndex = 0;
    return (
            <Group
            className={styles.cmpsContainer}
            gap={0}
            wrap={'wrap'}
            align={'center'}>
            {uiData.map((d,i) => {
                if (typeof d === 'string')
                    return <span className={styles.textCmp} key={i}>{d}</span>;
                else {
                    const currentCmpIndex = cmpIndex;
                    const defaultValue = state ? state.data[currentCmpIndex] ?? undefined : undefined;
                    let cmp;
                    if(d.type === 'cmb'){
                        if(isNotNullNorUndef(defaultValue) && typeof defaultValue !== 'number'){
                            throw new Error('Incorrect type of default value');
                        }
                        // avoid rerendering - every render new string instance (cmpIndex.toString()) - pass data attributes to input
                        cmp = <ComboboxCmp 
                        className={styles.inputCmp}
                        defaultValue={defaultValue} 
                        key={i}
                        options={d.values} 
                        onSelectionChange={(_value,index) => onChange(index,currentCmpIndex)} />;
                    }
                    else{
                        if(isNotNullNorUndef(defaultValue) && typeof defaultValue !== 'string'){
                            throw new Error('Incorrect type of default value');
                        }
                        cmp = <TxtInputCmp 
                        className={styles.inputCmp}
                        defaultValue={defaultValue} 
                        key={i} 
                        onChange={(e) => onChange(e.target.value,currentCmpIndex)} />
                    }
                        console.log(`cmpIndex: ${cmpIndex}`);
                    ++cmpIndex;
                    return cmp;
                }

            })}
            </Group>
        );
});
FillInBlanksTakeCmp.displayName = 'FillInBlanksTakeCmp';
export { FillInBlanksTakeCmp, type FillInBlanksTakeCmpProps }