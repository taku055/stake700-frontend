import { apiAgentCreateSubuser } from "@/api/agent/apiAgentCreateSubuser";
import { tUser } from "@/types/tUser";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "preact/hooks";
import { FaLock, FaUser } from "react-icons/fa";
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
  const toastT = useTranslations("ToastMessages");

  useEffect(() => {
    setName("");
    setPassword("");
  }, [isOpen]);

  const onCreate = useCallback(async () => {
    try {
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
  }, [name, password, onCreated]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="bottom-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create Subuser
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                endContent={
                  <FaUser className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="User name"
                placeholder="Enter the user name"
                variant="bordered"
                disabled={loading}
                value={name}
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
              />
              <Input
                endContent={
                  <FaLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Password"
                placeholder="Enter the user password"
                type="password"
                variant="bordered"
                disabled={loading}
                value={password}
                onChange={(e) =>
                  setPassword((e.target as HTMLInputElement).value)
                }
              />
              <Input
                endContent={
                  <FaLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Email"
                placeholder="Enter the subuser email"
                variant="bordered"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
