import { apiAdminCreateSubuser } from "@/api/agent/apiAdminCreateSubuser";
import { tUser } from "@/types/tUser";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@/components/common";
import { Button } from "@heroui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "preact/hooks";
import { FaEyeSlash, FaEye, FaLock, FaUser } from "react-icons/fa";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";

interface CreateSubuserModalProps {
  agentId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (agent: tUser) => void;
}

export default function CreateSubuserModal({
  agentId,
  isOpen,
  onClose,
  onCreated,
}: CreateSubuserModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toastT = useTranslations("ToastMessages");

  useEffect(() => {
    setName("");
    setPassword("");
  }, [isOpen]);

  const onCreate = useCallback(async () => {
    try {
      setLoading(true);
      const agent = await apiAdminCreateSubuser(agentId, name, password);
      onCreated(agent);
      toast.success(toastT("success.subagent_created"));
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.error(ex.response);
        toast.error(ex.response?.data?.message?.message);
      } else {
        console.error(ex);
        toast.error(toastT("error.create_agent"));
      }
    }
    setLoading(false);
  }, [agentId, name, password]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-[var(--background)]">
        <ModalHeader className="flex flex-col gap-1">
          Create Subuser
        </ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          <Input
            autoFocus
            endContent={<FaUser size={16} color="var(--primary-color)" />}
            label="User name"
            placeholder="Enter the user name"
            variant="bordered"
            disabled={loading}
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
          />
          <Input
            endContent={
              !showPassword ? (
                <FaEye
                  size={16}
                  color="var(--primary-color)"
                  onClick={() => setShowPassword(true)}
                />
              ) : (
                <FaEyeSlash
                  size={16}
                  color="var(--primary-color)"
                  onClick={() => setShowPassword(false)}
                />
              )
            }
            label="Password"
            placeholder="Enter the agent password"
            type={showPassword ? "text" : "password"}
            variant="bordered"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={onCreate} isLoading={loading}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
