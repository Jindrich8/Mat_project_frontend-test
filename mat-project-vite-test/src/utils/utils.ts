

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

export { hasOwnProperty,resizeInput,resizeInput31,getResizerValue,isNullOrUndef, isNotNullNorUndef};