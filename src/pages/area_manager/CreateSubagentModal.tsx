import { apiAdminCreateSubagent } from "@/api/agent/area_manager/apiAdminCreateSubagent";
import { userState } from "@/state/userState";
import { tAgent } from "@/types/tAgent";
import { Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@/components/common";
import axios from "axios";
import { useEffect, useState } from "preact/hooks";
import { FaEyeSlash, FaEye, FaLock, FaUser } from "react-icons/fa";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";

interface CreateSubagentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (agent: tAgent) => void;
}

export default function CreateSubagentModal({
  isOpen,
  onClose,
  onCreated,
}: CreateSubagentModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toastT = useTranslations("ToastMessages");

  useEffect(() => {
    setName("");
    setPassword("");
  }, [isOpen]);

  const onCreate = async () => {
    try {
      if (!userState.value?.id) {
        toast.error(toastT("error.cant_create_subuser"));
        return;
      }

      setLoading(true);
      const agent = await apiAdminCreateSubagent(
        userState.value.id!,
        name,
        password
      );
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
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-[var(--background)]">
        <ModalHeader className="flex flex-col gap-1">
          Create Sub-agent
        </ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          <Input
            autoFocus
            endContent={<FaUser size={16} color="var(--primary-color)" />}
            label="Agent name"
            placeholder="Enter the agent name"
            variant="bordered"
            disabled={loading}
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
          />
          <Input
            endContent={
              !showPassword ? (
                <FaEye size={16} color="var(--primary-color)" onClick={() => setShowPassword(true)} />
              ) : (
                <FaEyeSlash size={16} color="var(--primary-color)" onClick={() => setShowPassword(false)} />
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
