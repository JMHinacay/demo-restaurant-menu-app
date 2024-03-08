import { useMemo } from "react";
import numeral from "numeral";
const NumeralFormatter = ({
  value,
  format = "0,0.00",
  withPesos = true,
}: NumeralFormatterT) => {
  const memoizedNumeral = useMemo(
    () => numeral(value).format(format),
    [value, format]
  );
  if (withPesos) return <span>&#x20B1;{memoizedNumeral}</span>;
  else return <span>{memoizedNumeral}</span>;
};
type NumeralFormatterT = {
  value: number | string;
  format?: string;
  withPesos: boolean;
};
export default NumeralFormatter;
