import { useMemo } from "preact/hooks";
import styles from "./TokenAmountInput.module.scss";
import { numberRound } from "@/helpers/numberRound";
import { JSX } from "preact/jsx-runtime";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";

type TokenAmountInputProps = JSX.IntrinsicElements["input"] & {
  usdPrice: number;
  tokenSymbol: string;
};

export default function TokenAmountInput(props: TokenAmountInputProps) {
  const tokenAmount = useMemo(
    () => numberRound(+(props.value || "0") / props.usdPrice, 10000),
    [props.value, props.usdPrice]
  );

  const inputProps = useMemo(() => {
    const props1: any = { ...props };
    delete props1.usdPrice;
    delete props1.tokenSymbol;
    return props1;
  }, [props]);

  return (
    <div className={styles.tokenAmountInput}>
      <input {...inputProps} />
      <div className={styles.token}>{tokenAmount} {props.tokenSymbol}</div>
      <div className={styles.usd}>{DEFAULT_CURRENCY_SYMBOL}</div>
    </div>
  );
}
