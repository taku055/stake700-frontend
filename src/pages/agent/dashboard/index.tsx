import { User } from "lucide-preact";
import styles from "./Dashboard.module.scss";
import DashboardCard from "./DashboardCard";
import { useEffect, useState } from "preact/hooks";
import { userState } from "@/state/userState";
import { apiAgentGetSubuserCount } from "@/api/agent/apiAgentGetSubuserCount";
import PlatformAnalysis from "./PlatformAnalysis";
import { useTranslations } from "@/context/I18nContext";

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const t = useTranslations("Agent");

  useEffect(() => {
    if (userState.value?.isAgent) {
      (async () => {
        try {
          const res = await apiAgentGetSubuserCount();
          setUserCount(res);
        } catch (ex) {
          console.error(ex);
        }
      })();
    }
  }, [userState.value]);

  return (
    <div className={styles.page}>
      <div className="flex gap-4">
        <DashboardCard icon={<User />} title={t("Users")} value={userCount} />
      </div>
      <PlatformAnalysis />
    </div>
  );
}
