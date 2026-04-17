import { useMemo, useState } from "preact/hooks";
import { providerState } from "@/state/providerState";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
} from "@heroui/react";
import { Search } from "lucide-preact";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[calc(var(--viewport-height)-158px)] md:max-h-[calc(var(--viewport-height)-300px)] overflow-auto">
            {providerList.map((p) => (
              <a
                key={p.id}
                href={`/gallery/all?providerId=${p.id}`}
                onClick={() => onClose()}
                className="flex flex-col justify-center items-center rounded-lg p-3 hover:shadow-md transition text-center text-[#F9FAFA] bg-[var(--background)]"
              >
                {p.img ? (
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-contain"
                    title={p.name}
                  />
                ) : (
                  <span>{p.name}</span>
                )}
              </a>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
