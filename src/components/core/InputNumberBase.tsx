import { useEffect, useState } from 'react';
import NumberFormat, { NumberFormatValues, SourceInfo } from 'react-number-format';
import { InputNumberBasePropsTypes } from './types/InputNumberBasePropsTypes';

export const InputNumberBase = (props: InputNumberBasePropsTypes) => {
  const [val, setVal] = useState<string | number>(props.value);

  const onValueChange = (values: NumberFormatValues, sourceInfo: SourceInfo) => {
    const { formattedValue, /*value,*/ floatValue } = values;
    if (formattedValue === '' && floatValue === undefined) {
      setVal(0);
      props.setValueFn(0);
    } else {
      setVal(formattedValue);
      props.setValueFn(floatValue as number);
    }
  };

  useEffect(() => {
    setVal(props.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  return (
    <NumberFormat
      className={props.className ?? ''}
      thousandsGroupStyle='thousand'
      value={val}
      prefix={props.prefix ?? ''}
      decimalSeparator={','}
      thousandSeparator={'.'}
      displayType='input'
      type='text'
      allowNegative={props.allowNegative ?? true}
      onValueChange={onValueChange}
      fixedDecimalScale
      decimalScale={props.maxDecimals}
      name={props.name ?? 'def'}
    />
  );
};
