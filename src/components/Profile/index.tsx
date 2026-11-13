import HistoryAccountDialog from "./dialogs/HistoryAccountDialog";
import ProfileAccountDialog from "./dialogs/ProfileAccountDialog";
import WalletAccountDialog from "./dialogs/WalletAccountDialog";

export default function AccountDialogs() {
  return (
    <>
      <WalletAccountDialog />
      <ProfileAccountDialog />
      <HistoryAccountDialog />
    </>
  );
}
