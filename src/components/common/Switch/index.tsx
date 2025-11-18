import styles from "./Switch.module.css";

type Props = {
  isSelected: boolean;
  onValueChange: (value: boolean) => void;
};

export const Switch = ({ isSelected, onValueChange }: Props) => {
  return (
    <label class={styles.switch}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e: any) => onValueChange(e.target.checked)}
      />
      <span class={styles.slider + " " + styles.round}></span>
    </label>
  );
};
