import { TitleOrder } from "@mantine/core";
import { Int } from "../types/primitives/Integer";
import { Immutable, ImmutableObject } from "@hookstate/core";
import { Any } from "../types/types";

const utcStrTimestampToLocalStr = (timestamp:string) => {
  return (new Date(timestamp)).toLocaleString();
};

const setSearchParam = (params:URLSearchParams,key:string,value:string|undefined|string[]) => {
  if(value === undefined){
    params.delete(key);
  }
  else{
    if(typeof value === "string"){
    params.set(key,value);
    }
    else{
      params.delete(key);
      appendArrayToSearchParams(params,key,value);
    }
  }
}

const tryStrToNum = <T,F>(str:T,fallback:F) => {
  return typeof str === 'string' ? Number(str) : fallback;
};

const nundef = <T,F>(value:T,fallback:F) => {
  return value === undefined ? fallback : value;
};

const hasOwnProps = (rec:Record<PropertyKey,unknown>): boolean =>{
  for(const prop in rec){
    if(Object.hasOwn(rec, prop)){
      return true;
    }
  }
  return false;
}

const arrayLast = <T>(arr:Array<T>):T => {
  return arr[arr.length - 1];
};

const appendArrayToSearchParams = (params:URLSearchParams, key:string,values:Iterable<string>):void =>{
  for(const item of values){
    params.append(key,item);
  }
}

const tryGetLastArrayValue = <T>(arr:T[]|ImmutableObject<T[]>):T|Immutable<T>|undefined =>{
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

const dump = (obj:object, indent:number = 2) => {
 const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_key:Any, value:Any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
  const retVal = JSON.stringify(
    obj,
   getCircularReplacer,
    indent
  );
  return retVal;
};

const isObjectEmpty = <T extends  object>(object:T): object is Record<PropertyKey,never> => {
  for (const _property in object) {
    // if any enumerable property is found object is not empty
    return false;
  }

  return true;
}
const narrowArray = <T,N extends T>(arr:readonly T[],narrower:(item:T) => item is N):arr is N[] => {
  return arr.length === 0 || narrower(arr[0]);
}

const hasOwnProperty = <X extends object, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> => {
  return Object.hasOwn(obj,prop);
}



const resizeInput = (
  input: HTMLInputElement,
  hidden:HTMLElement,
  newValue:string,
  options?:{forceResize?:boolean,padding?:number}
  ) => {
    console.log(`options: `+JSON.stringify(options));
    const forceResize = options?.forceResize ?? false;
    const padding = options?.padding ?? 0;
    console.log("padding: "+padding);
  console.log(`resize input '${hidden.textContent}' to '${newValue}'`);
  if (forceResize || newValue !== hidden.textContent) {
      hidden.textContent = newValue;
      const bounding = hidden.getBoundingClientRect().width;
    const px = (bounding + padding);
    console.log(`px: ${px} - ${bounding} + ${padding}`);
      const newWidth =  px+ 'px';
      input.style.width = newWidth;
  }
};

const getResizerValue = (
  inputValue: string,
  minSize?:string,
  placeholder?:string,
  placeholderMinSize?:string) => {
  return inputValue ?
      (minSize && minSize.length > inputValue.length) ? minSize : inputValue
      : ((placeholder ?? '').length >= (placeholderMinSize ?? '').length ? placeholder : placeholderMinSize) ?? '';
};

const resizeInput31 = (
  input:HTMLInputElement,
  hidden:HTMLElement,
  minSize?:string,
  placeholder?:string,
  placeholderMinSize?:string,
  options?:Parameters<typeof resizeInput>[3]
  ) => {
  resizeInput(
      input,
      hidden,
      getResizerValue(
          input.value,
          minSize,
          placeholder,
          placeholderMinSize),options);
};

const isNullOrUndef = (value?:undefined|null|unknown):value is (null | undefined) =>{
  return value === undefined || value === null;
  }

  const isNotNullNorUndef = (value?:undefined|null|unknown):value is NonNullable<unknown> =>{
    return value !== undefined && value !== null;
    }

const clamp = (value: number, min: number, max: number): number => {
  return value <= min ? min
    : value >= max ? max
      : value;
}

const intToTitleOrder = (value:Int):TitleOrder => {
  return clamp(value,1,6) as TitleOrder;
}

const toTitleOrder = (value:number):TitleOrder => {
  return Math.trunc(clamp(value,1,6)) as TitleOrder;
}

    const addIntToOrder = (order:TitleOrder,num:Int) =>{
      return intToTitleOrder(order + num as Int);
    }

    const addOneToOrder = (order:TitleOrder) => {
      if(order < 6){
        order+=1;
      }
      return order as TitleOrder;
    }

    const subsOneFromOrder = (order:TitleOrder) => {
      if(order > 1){
        order-=1;
      }
      return order as TitleOrder;
    }

    const getCssSelector = (ele:HTMLElement) =>
{
  let el:HTMLElement|null = ele;
    const names = [];
    do {
        let index = 0;
        let cursorElement:Element|null = el;
        while (cursorElement !== null)
        {
            ++index;
            cursorElement = cursorElement.previousElementSibling;
        }
        names.unshift(el.tagName + ":nth-child(" + index + ")");
        el = el.parentElement;
    } while (el !== null);
    return names.join(" > ");
}

const nbsp = '\u00A0';

const strStartAndEndWsToNbsp =(d:string) => {
  const trimmedStart = d.trimStart();
  const trimmedEnd = trimmedStart.trimEnd();
  const endWsCount = trimmedStart.length-trimmedEnd.length;
  const value = nbsp.repeat(d.length - trimmedStart.length)
   + trimmedStart.substring(0,trimmedStart.length - endWsCount)
   + nbsp.repeat(endWsCount);
   return value;
}

export {
  utcStrTimestampToLocalStr,
  setSearchParam,
  tryStrToNum,
  nundef,
  hasOwnProps,
  arrayLast,
  appendArrayToSearchParams,
  nbsp,
  strStartAndEndWsToNbsp,
  tryGetLastArrayValue,
  dump,
  narrowArray,
  isObjectEmpty,
  getCssSelector,
  clamp,
  addOneToOrder,
  subsOneFromOrder, 
  intToTitleOrder,
  toTitleOrder,
  addIntToOrder, 
  hasOwnProperty,
  resizeInput,
  resizeInput31,
  getResizerValue
  ,isNullOrUndef, 
  isNotNullNorUndef
};