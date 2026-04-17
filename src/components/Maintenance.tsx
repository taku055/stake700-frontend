import { maintenanceState } from "@/state/maintenanceState";
import { useEffect, useState } from "preact/hooks";
import { MdClose } from "react-icons/md";

export default function Maintenance() {
  const [alertVisible, setAlertVisible] = useState(true);
  
  if (!maintenanceState.value || !alertVisible) return null;

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertVisible(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-between w-full p-5 border-t border-[var(--pink-color)] rounded-sm bg-danger fixed top-0 left-0 z-[10]">
        <span>{maintenanceState.value}</span>
        <MdClose
          size={24}
          color="white"
          className="cursor-pointer"
          onClick={() => setAlertVisible(false)}
        />
      </div>
    </div>
  );
}
