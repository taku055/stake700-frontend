import { ComponentChildren } from "preact";
import styles from "./DashboardCard.module.scss";

interface DashboardCardProps {
  icon: ComponentChildren;
  title: string;
  value: string | number;
}

export default function DashboardCard({
  icon,
  title,
  value,
}: DashboardCardProps) {
  return (
    <div className={styles.container}>
      {icon}
      <div className="flex flex-col">
        <label>{title}</label>
        <span>{value}</span>
      </div>
    </div>
  );
}
