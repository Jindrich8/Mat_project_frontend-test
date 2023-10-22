import { AtLeastOneOf, Opaque } from "../base";
import { ErrorSymbol } from "../symbols";

type Int = Opaque<number,'Int'>;



const toInt = (x:number):Int => {
    return Math.trunc(x) as Int;
}

const isInt = (x:number):boolean => {
    return toInt(x) === x;
}

const tryToInt = (x:number):Int | typeof ErrorSymbol => {
const intX = toInt(x);
return (intX === x) ? intX : ErrorSymbol;
}

const toBecauseStr = (because?:string) => `${because ? `, because ${because}`:''}`;

const shouldBeInt = (x:number,paramName:string,because?:string):Int => {
const int = tryToInt(x);
if(int === ErrorSymbol)throw new Error(`${paramName} '${x}' should be an integer${toBecauseStr(because)}.`);
return int;
}

const shouldBeInInclRange = (x:Int,paramName:string,range:AtLeastOneOf<{min:Int},{max:Int}>,because?:string) => {
   const int = x;
   if(range.min !== undefined && int < range.min) throw new Error(`${paramName} '${x}' should be bigger or equal to ${range.min}${toBecauseStr(because)}.`);
    if(range.max !== undefined && int > range.max) throw new Error(`${paramName} '${x}' should be smaller or equal to ${range.max}${toBecauseStr(because)}.`);
    return int;
}

const shouldBeInRange = (x:Int,paramName:string,range:AtLeastOneOf<{min:Int},{end:Int}>,because?:string) => {
    const int = x;
   if(range.min !== undefined && int < range.min) throw new Error(`${paramName} '${x}' should be bigger or equal to ${range.min}${toBecauseStr(because)}.`);
    if(range.end !== undefined && int >= range.end) throw new Error(`${paramName} '${x}' should be smaller than ${range.end}${toBecauseStr(because)}.`);
    return int;
}

const IntHelper = {
    isInt,
    toInt,
    tryToInt,
    shouldBeInt,
    shouldBeInRange,
    shouldBeInInclRange
};

export {type Int, IntHelper};