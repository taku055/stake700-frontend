import { useState, useEffect } from "preact/hooks";
import { toast } from "@/helpers/toast";
import TextWithCopy from "@/components/TextWithCopy";
import { Button } from "@heroui/button";
import { apiAdminChangePassword } from "@/api/agent/area_manager/apiAdminChangePassword";
import UserInfoField from "@/components/UserInfoField";
import { checkSum } from "@/helpers/checkSum";
import { Checkbox } from "@heroui/checkbox";
import { apiAdminUpdateUser } from "@/api/agent/area_manager/apiAdminUpdateUser";
import { multipleBalanceRows } from "@/helpers/multipleBalance";
import { tUser } from "@/types/tUser";
import { userState } from "@/state/userState";
import { apiAdminGetUser } from "@/api/agent/area_manager/apiAdminGetUser";

export default function PlayerInfoPage({ userId }: {userId: string}) {
  const [user, setUser] = useState<tUser>();
  const [showBalanceDetail, setShowBalanceDetail] = useState(false);
  const [isCallGroup, setIsCallGroup] = useState(user?.isCallGroup || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (userState.value?.id) {
      (async () => {
        try {
          const res = await apiAdminGetUser(userId);
          setUser(res);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [userState.value?.id]);

  const onChangePassword = async () => {
    const password = window.prompt("Please input the new password");
    if (!password) {
      if (password !== null) {
        toast.error("Password is empty");
      }
      return;
    }

    try {
      const res = await apiAdminChangePassword(userId, password);
      toast.success("Successfully changed password");
      setUser((p) => (p ? { ...p, ...res } : p));
    } catch (error) {
      toast.error("Something went wrong in changing password");
      console.error(error);
    }
  };

  const onSubmitBasicInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await apiAdminUpdateUser(userId, { isCallGroup });
      toast.success("Successfully updated basic info");
      setUser((p) => (p ? { ...p, ...res } : p));
    } catch (error) {
      toast.error("Something went wrong in updating basic info");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Account Information */}
      <div className="card flex w-full flex-col p-4 gap-4">
        <h4 className="text-xl font-semibold">Basic Account Information</h4>

        <form onSubmit={onSubmitBasicInfo} className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default-600">
                User ID
              </label>
              <TextWithCopy text={userId} />
            </div>

            <UserInfoField label="Username" value={user?.userName} />
            <UserInfoField label="Email" value={user?.email} />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default-600">
                Password
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">********</span>
                <Button size="sm" className="px-3" onPress={onChangePassword}>
                  Change
                </Button>
              </div>
            </div>

            <UserInfoField
              label="Created At"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : null
              }
            />
            <UserInfoField
              label="Account Status"
              value={user?.isDeleted ? "Deleted" : "Active"}
            />
            <UserInfoField
              label="Last Login At"
              value={
                user?.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString()
                  : null
              }
            />
          </div>
        </form>
      </div>

      {/* Financial Information */}
      <div className="card flex w-full flex-col p-4 gap-4">
        <h4 className="text-xl font-semibold">Financial Information</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-default-600">
              Balance
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {multipleBalanceRows(user?.cashDetails || [])}
              </span>
              <Button
                size="sm"
                className="px-2 min-w-[unset]"
                onClick={() => setShowBalanceDetail(true)}
              >
                Details
              </Button>
            </div>
          </div>

          <UserInfoField label="VIP Level" value={user?.vipLevel || 1} />
          <UserInfoField label="Referrer" value={user?.referer?.userName} />
          <UserInfoField label="Refer Code" value={user?.referCode} />
          <UserInfoField
            label="Checksum"
            value={checkSum(user, user?.cash || 0)}
          />
        </div>
      </div>
    </div>
  );
}
