import { apiAgentCreateSubuser } from "@/api/agent/apiAgentCreateSubuser";
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
import { useEffect, useState } from "preact/hooks";
import { FaEyeSlash, FaEye, FaLock, FaMailBulk, FaUser } from "react-icons/fa";
import { toast } from "@/helpers/toast";
import { useTranslations } from "@/context/I18nContext";

interface CreateSubuserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (agent: tUser) => void;
}

export default function CreateSubuserModal({
  isOpen,
  onClose,
  onCreated,
}: CreateSubuserModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const t = useTranslations("Agent");
  const toastT = useTranslations("ToastMessages");

  useEffect(() => {
    setName("");
    setPassword("");
    setEmail("");
    setShowPassword(false);
  }, [isOpen]);

  const onCreate = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error(toastT("validation.invalid_email"));
        return;
      }

      setLoading(true);
      const agent = await apiAgentCreateSubuser(name, password, email);
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
          {t("Create Subuser")}
        </ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          <Input
            autoFocus
            endContent={
              <FaUser size={16} color="var(--primary-color)" />
            }
            label={t("User name")}
            placeholder={t("Enter the subuser name")}
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
            label={t("Password")}
            placeholder={t("Enter the agent password")}
            type={showPassword ? "text" : "password"}
            variant="bordered"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
          <Input
            endContent={
              <FaMailBulk size={16} color="var(--primary-color)" />
            }
            label={t("Email")}
            placeholder={t("Enter the subuser email")}
            variant="bordered"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            {t("Close")}
          </Button>
          <Button color="primary" onPress={onCreate} isLoading={loading}>
            {t("Create")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
