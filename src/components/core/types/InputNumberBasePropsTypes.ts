export type InputNumberBasePropsTypes = {
    setValueFn: (inputValue: number) => void;
    value: number;
    maxDecimals: number;
    placeholder?: string;
    className?: string;
    allowNegative?: boolean | undefined
    prefix?: string | undefined;
    name?: string;
}