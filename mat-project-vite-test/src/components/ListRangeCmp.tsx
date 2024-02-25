import { Group, InputLabel, Stack, Text } from "@mantine/core";
import React, { FC, MutableRefObject } from "react"
import { SearchableSelect } from "./SearchableSelectCmp";

interface Props {
    options: string[],
    label?:React.ReactNode
    required?:boolean
    error?:React.ReactNode
    apiRef: MutableRefObject<{ getValidData: () => undefined | [min: number, max: number] }>
}

const InvalidOptionSelected = 'Invalid option selected!';
const MaxShouldBeGreaterThanOrEqualToMin = 'Max should be greater than or equal to min!';
const OptionIsRequired = 'Option is required!';

const ListRangeCmp: FC<Props> = ({ options, apiRef,label,error,required }) => {
    console.log("ListRangeCmp: ",JSON.stringify(options));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = React.useMemo(()=>
        options.map((opt, i) => ({
            label: opt,
            value: i.toString()
        })),[options]);


    const [min, setMin] = React.useState<[num: number, str: string] | undefined>(undefined);
    const [max, setMax] = React.useState<[num: number, str: string] | undefined>(undefined);
    const [noUndef, setNoUndef] = React.useState(false);
 const getValidData = React.useCallback<()=>[min:number,max:number]|undefined>(() => {
    console.log("getValidData");
    if (!(min && max &&
        (options[min[0]] && options[max[0]]) !== undefined
        && min[0] <= max[0]
    )) {
        if(required){
        setNoUndef(true);
        }
        return undefined;
    }
    return [min[0], max[0]];
 },[min,max,options,required]);
    apiRef.current.getValidData = getValidData;

    let minError = undefined;
    let maxError = undefined;

    if (min !== undefined) {
        if (options[min[0]] === undefined) {
            minError = InvalidOptionSelected;
        }
    }
    else if (noUndef) {
        minError = OptionIsRequired;
    }

    if (max !== undefined) {
        if (options[max[0]] === undefined) {
            maxError = InvalidOptionSelected;
        }
        else if (min !== undefined && max[0] < min[0]) {
            maxError = MaxShouldBeGreaterThanOrEqualToMin;
        }
    }
    else if (noUndef) {
        maxError = OptionIsRequired;
    }
    console.log(`minError: ${minError}, maxError: ${maxError}`);

    const onChange = React.useCallback((type: 'min' | 'max', index: number) => {
        
        if (type === 'min') {
            console.log("Set min");
            setMin([index, index + '']);
        }
        else {
            console.log("Set max");
            setMax([index, index + '']);
        }
    }, []);
    const onMinChange = React.useCallback((_label: string, value: string) => {
        const index = Number(value) ?? 0;
        onChange('min', index);
    }, [onChange]);
    const onMaxChange = React.useCallback((_label: string, value: string) => {
        const index = Number(value) ?? 0;
        onChange('max', index);
    }, [onChange]);

    const errorStrBool = error ? '' : undefined;
    return (
        <>
        <Group>
        {label && <InputLabel required={required}>{label}</InputLabel>}
        <Stack>
            <Group id={'MultiSelectGroup'} style={{display:'flex',flexDirection:'row',flexWrap:'nowrap',alignItems:'flex-start'}}>
                <SearchableSelect
                style={{float:'left'}}
                    options={data}
                    value={min && min[1]}
                    required={required}
                    aria-label={'Min'}
                    onChange={onMinChange}
                    error={minError ?? errorStrBool}
                    placeholder={'Min'}
                />
                <Text>-</Text>
                <SearchableSelect
                style={{float:'left'}}
                    options={data}
                    required={required}
                    value={max && max[1]}
                    error={maxError ?? errorStrBool}
                    //error={"WTF"}
                    onChange={onMaxChange}
                    aria-label={'Max'}
                    placeholder={"Max"} />
            </Group>
            {error && <Text c={'red'}>{error}</Text>}
            </Stack>
            </Group>
        </>
    )
};

export { ListRangeCmp, type Props as ListRangeCmpProps };
