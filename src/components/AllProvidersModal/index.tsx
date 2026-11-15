import { useMemo, useState } from "react";
import { providerState } from "@/state/providerState";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
} from "@heroui/react";
import { Search } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { mobileMediaQuery } from "@/config/constants";
import { ProviderCard } from "@/components/ProviderCard";
import { providerHref } from "@/helpers/providerHref";

interface IAllProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllProvidersModal({
  isOpen,
  onClose,
}: IAllProvidersModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useMediaQuery(mobileMediaQuery);

  const providerList = useMemo(() => {
    const array = providerState.value.array
      .filter((p) => p.added_slot)
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return array.sort((a, b) => {
      if (a.order != b.order) {
        return a.order - b.order;
      }

      if (a.name != b.name) {
        return a.name.localeCompare(b.name);
      }

      return a.id.localeCompare(b.id);
    });
  }, [providerState.value.array, searchTerm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isMobile ? "md" : "4xl"}
      placement={isMobile ? "top" : "center"}
      className="bg-[var(--bar-background-color)]"
      classNames={{
        backdrop:
          "custom-modal-backdrop bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-40",
        wrapper: "custom-modal-wrapper",
      }}
    >
      <ModalContent>
        <ModalHeader>All Providers</ModalHeader>
        <ModalBody>
          <Input
            label="Search"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            variant="bordered"
            endContent={<Search size={24} />}
          />
          <div className="grid grid-cols-1 gap-2.5 p-0.5 sm:grid-cols-2 lg:grid-cols-3 max-h-[calc(var(--viewport-height)-158px)] md:max-h-[calc(var(--viewport-height)-300px)] overflow-auto">
            {providerList.map((p) => (
              <ProviderCard key={p.id} name={p.name} href={providerHref(p.id)} count={p.count} onClick={() => onClose()} />
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
