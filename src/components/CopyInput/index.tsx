import { useState } from "preact/hooks";
import styles from "./CopyInput.module.scss";
import { useTranslations } from "@/context/I18nContext";

interface CopyInputProps {
  value: string;
  onCopy?: () => void;
}

export default function CopyInput(props: CopyInputProps) {
  const [buttonText, setButtonText] = useState("Copy");
  const t = useTranslations("Wallet");

  const onCopy = () => {
    props.onCopy?.();
    navigator.clipboard.writeText(props.value);
    setButtonText("Copied");
    setTimeout(() => setButtonText("Copy"), 1000);
  };

  return (
    <div className={styles["copy-input"]}>
      <div>{props.value}</div>
      <button type="button" className="btn btn-primary-black" onClick={onCopy}>
        {t(buttonText)}
      </button>
    </div>
  );
}
