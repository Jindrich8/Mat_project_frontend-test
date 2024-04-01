import { Group, InputLabel, MantineStyleProps, Stack, Text } from "@mantine/core";
import React, { FC } from "react"
import { SearchableSelect, SearchableSelectProps } from "../SearchableSelectCmp";

type Props = MantineStyleProps &
    {
        options: string[],
        label?: React.ReactNode
        error?: React.ReactNode,
        required?: boolean,
        min?:number,
        max?:number,
        onChange?: (type: 'min' | 'max', value: number | undefined) => void,
        minError?:string,
        maxError?:string,
    };


const ListRangeCmp: FC<Props> = ({minError,maxError,options,onChange,min,max,label,required,error,...base}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = React.useMemo(() =>
        options.map((opt, i) => ({
            label: opt,
            value: i.toString()
        })), [options]);

        const onMinMaxChange = React.useCallback<NonNullable<SearchableSelectProps['onChange']>>((option,selId) => {
            const type = selId === 'min' ? 'min' : 'max';
            const index = option?.value === undefined ?
             undefined 
            : Number(option.value);
    
            onChange && onChange(type, index);
        }, [onChange]);

   

    return (
            <Stack {...base}>
                {label && <InputLabel required={required}>{label}</InputLabel>}
                <Stack>
                    <Group id={'MultiSelectGroup'} align={'flex-start'} justify={'center'}>
                        <SearchableSelect
                            style={{ float: 'left' }}
                            options={data}
                            value={min+''}
                            required={required}
                            selId={'min'}
                            aria-label={'Min'}
                            onChange={onMinMaxChange}
                            error={minError}
                            placeholder={'Min'}
                        />
                        <Text>-</Text>
                        <SearchableSelect
                            style={{ float: 'left' }}
                            options={data}
                            required={required}
                            value={max+''}
                            selId={'max'}
                            error={maxError}
                            onChange={onMinMaxChange}
                            aria-label={'Max'}
                            placeholder={"Max"} />
                    </Group>
                    {error && <Text c={'red'}>{error}</Text>}
                </Stack>
            </Stack>
    )
};

export { ListRangeCmp, type Props as ListRangeCmpProps };
