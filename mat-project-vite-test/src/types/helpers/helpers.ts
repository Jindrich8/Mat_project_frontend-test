type PrefixedRecord<TPrefix extends string, TValue> = {
    [x in `${TPrefix}${string}`]: TValue;
  };

  export {type PrefixedRecord};