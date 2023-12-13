import { TitleOrder } from "@mantine/core";
import { Int } from "../types/primitives/Integer";


const hasOwnProperty = <X extends object, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> => {
  return Object.hasOwn(obj,prop);
}

const resizeInput = (input: HTMLInputElement,hidden:HTMLElement,newValue:string,forceResize:boolean = false) => {
  if (forceResize || newValue !== hidden.textContent) {
      hidden.textContent = newValue;

      const newWidth = hidden.getBoundingClientRect().width + 'px';
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
  placeholderMinSize?:string) => {
  resizeInput(
      input,
      hidden,
      getResizerValue(
          input.value,
          minSize,
          placeholder,
          placeholderMinSize));
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

export {getCssSelector,clamp,addOneToOrder,subsOneFromOrder, intToTitleOrder,toTitleOrder,addIntToOrder, hasOwnProperty,resizeInput,resizeInput31,getResizerValue,isNullOrUndef, isNotNullNorUndef};