type Cmb = {
    type: 'cmb',
    values: string[],
}
type TxtInput = {
    type: 'txtInput',
}

interface DoplnovackaContent {
uiData:(string | Cmb | TxtInput)[],
filledData?:(string|number|undefined)[]
}

export type {Cmb, TxtInput, DoplnovackaContent}