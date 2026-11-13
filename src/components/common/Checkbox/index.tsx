import type { ReactNode as ComponentChildren } from "react";
import styles from "./Checkbox.module.css";

type Props = {
  children: ComponentChildren;
  isSelected: boolean;
  onValueChange: (value: boolean) => void;
};

export const Checkbox = ({ children, isSelected, onValueChange }: Props) => {
  return (
    <label className={styles.container}>
      {children}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e: any) => onValueChange(e.target.checked)}
      />
      <span className={styles.checkmark}></span>
    </label>
  );
};
