import { ComponentChildren } from "preact";
import styles from "./Checkbox.module.css";

type Props = {
  children: ComponentChildren;
  isSelected: boolean;
  onValueChange: (value: boolean) => void;
};

export const Checkbox = ({ children, isSelected, onValueChange }: Props) => {
  return (
    <label class={styles.container}>
      {children}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e: any) => onValueChange(e.target.checked)}
      />
      <span class={styles.checkmark}></span>
    </label>
  );
};
