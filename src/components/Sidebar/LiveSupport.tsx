import { FunctionComponent } from "preact";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";
import { loginOpenedState } from "@/state/loginOpenedState";
import { userState } from "@/state/userState";

export const LiveSupport: FunctionComponent = () => {
  const open = () => {
    if (!userState.value) {
      loginOpenedState.value = true;
      return;
    }
    liveSupportExpandedState.value = true;
  };

  return (
    <button
      type="button"
      className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--background-secondary)] rounded-md"
      onClick={open}
    >
      Open live chat
    </button>
  );
};
