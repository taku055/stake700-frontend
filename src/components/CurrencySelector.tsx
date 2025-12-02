import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { CURRENCY_LIST } from "@/config/constants";
import { eTransactionCurrency } from "@/types/tTransaction";
import { FaChevronDown } from "react-icons/fa";

interface CurrencySelectorProps {
  value: eTransactionCurrency;
  onChange: (currency: eTransactionCurrency) => void;
  className?: string;
}

export default function CurrencySelector({
  value,
  onChange,
  className,
}: CurrencySelectorProps) {
  const selectedCurrency = CURRENCY_LIST.find((c) => c.unit === value);

  return (
    <Dropdown className={className}>
      <DropdownTrigger>
        <div className="!capitalize bg-[#fff1] flex items-center justify-center px-4 py-2 gap-2 rounded-sm">
          {selectedCurrency?.unit || value}
          <FaChevronDown />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Currency selection"
        variant="flat"
        closeOnSelect={true}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={new Set([value])}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as eTransactionCurrency;
          onChange(selected);
        }}
      >
        {CURRENCY_LIST.map((currency) => (
          <DropdownItem key={currency.unit}>
            {currency.unit} - {currency.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
