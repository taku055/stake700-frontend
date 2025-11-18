import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@/components/common";
import { useMoreToolList } from "@/hooks/useMoreToolList";
import { useTranslations } from "@/context/I18nContext";

interface IMoreToolDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoreToolDialog = ({ isOpen, onClose }: IMoreToolDialogProps) => {
  const { tabList } = useMoreToolList();
  const t = useTranslations("MoreToolDialog");

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      classNames={{
        backdrop: "z-[10000000] bg-transparent! backdrop-opacity-0!",
        wrapper: "z-[10000000] p-0!",
      }}
    >
      <ModalContent className="w-screen bg-[var(--bar-background-color)] mt-[50px] h-[calc(var(--viewport-height)-50px)] max-h-[calc(var(--viewport-height)-50px)]! rounded-none! pb-10">
        <ModalHeader className="p-2! font-normal!">{t("Menu")}</ModalHeader>
        <ModalBody className="p-2!">
          <div className="flex flex-col min-h-full gap-[30px]">
            {tabList.map((tab) => (
              <div key={tab.title} className="flex flex-col gap-[10px]">
                <span className="text-[12px] uppercase">{tab.title}</span>
                <ul className="flex flex-col gap-[10px]">
                  {tab.items.map((item) => (
                    <li>
                      <a
                        href={item.href}
                        key={item.key}
                        className="text-[14px] flex flex-row min-w-fit items-center gap-[10px] p-[9px] rounded-md bg-gray-700"
                        onClick={() => onClose()}
                      >
                        <img
                          src={item.icon}
                          alt={item.title}
                          className="w-[28px] h-[28px]"
                        />
                        <span className="whitespace-nowrap">{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MoreToolDialog;
