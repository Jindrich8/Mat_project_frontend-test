import React, { FC } from "react";
import { ExerciseContentCmpProps } from "../ExerciseBase";
import { ComboboxCmp } from "./components/ComboboxCmp";
import { TxtInputCmp } from "./components/TxtInputCmp";
import { Group } from "@mantine/core";
import styles from "./DoplnovackaCmpStyle.module.css"
import { isNotNullNorUndef } from "../../utils/utils";

type Cmb = {
    type: 'cmb',
    values: string[],
}
type TxtInput = {
    type: 'txtInput'
}

interface DoplnovackaCmpProps extends ExerciseContentCmpProps {
    data: (string | Cmb | TxtInput)[];
    defaultFilledData?:[string|number];
}


const DoplnovackaCmp: FC<DoplnovackaCmpProps> = ({ data,defaultFilledData, apiRef }) => {

    const cmpData = React.useRef<unknown[]>([]);


    const onChange = React.useCallback((value:unknown,i:number) => {
        console.log(`${i}: ${value}`);
        cmpData.current[i] = value;
    }, [cmpData]);
    apiRef.getFilledDataForServer = () => cmpData.current;

    let cmpIndex = 0;
    return (
            <Group
            className={styles.cmpsContainer}
            gap={0}
            wrap={'wrap'}
            align={'center'}>
            {data.map((d,i) => {
                if (typeof d === 'string')
                    return <span className={styles.textCmp} key={i}>{d}</span>;
                else {
                    const currentCmpIndex = cmpIndex;
                    const defaultValue = defaultFilledData ? defaultFilledData[currentCmpIndex] ?? undefined : undefined;
                    let cmp;
                    if(d.type === 'cmb'){
                        if(isNotNullNorUndef(defaultValue) && typeof defaultValue !== 'number'){
                            throw new Error('Incorrect type of default value');
                        }

                        // avoid rerendering - every render new string instance (cmpIndex.toString()) - pass data attributes to input
                        cmp = <ComboboxCmp defaultValue={defaultValue} key={i} options={d.values} onSelectionChange={(value) => onChange(value,currentCmpIndex)} />;
                    }
                    else{
                        if(isNotNullNorUndef(defaultValue) && typeof defaultValue !== 'string'){
                            throw new Error('Incorrect type of default value');
                        }
                        cmp = <TxtInputCmp defaultValue={defaultValue} key={i} onChange={(e) => onChange(e.target.value,currentCmpIndex)} />
                    }
                        console.log(`cmpIndex: ${cmpIndex}`);
                    ++cmpIndex;
                    return cmp;
                }

            })}
            </Group>
        );
}

export { DoplnovackaCmp, type DoplnovackaCmpProps }