import { Select, SelectItem } from "@heroui/react";
import { chainNames, getChainIconUrl } from "@/config/chains";
import type { tToken } from "@/types/tToken";

const SELECT_CLASSNAMES = {
  base: "max-w-md",
  trigger:
    "rounded-[8px]! bg-white! border border-neutral-200 min-h-[52px] h-auto py-1.5 data-[hover=true]:bg-neutral-50!",
  value: "text-black! text-sm font-medium gap-2",
  label:
    "text-neutral-500! group-data-[filled=true]:text-neutral-700! font-normal text-xs",
  listboxWrapper: "max-h-[280px] !bg-white bg-white",
  listbox: "!bg-white bg-white p-0",
  popoverContent:
    "!bg-white bg-white rounded-[8px] border border-neutral-200 shadow-lg p-0 overflow-hidden",
} as const;

/** Light dropdown surface (popover + list + rows) over dark app theme */
const SELECT_POPOVER_PROPS = {
  shouldCloseOnScroll: false,
  shouldBlockScroll: true,
  classNames: {
    content:
      "!bg-white bg-white rounded-[8px] border border-neutral-200 shadow-lg p-0 overflow-hidden",
  },
} as const;

const SELECT_LISTBOX_PROPS = {
  classNames: {
    base: "!bg-white bg-white p-0 min-w-[var(--trigger-width)]",
  },
  itemClasses: {
    base:
      "!bg-transparent text-neutral-900 data-[hover=true]:!bg-neutral-100 data-[selectable=true]:focus:!bg-neutral-100 data-[pressed=true]:!bg-neutral-100",
    title: "text-neutral-900",
  },
} as const;

function firstKey(keys: unknown): string | undefined {
  if (keys === "all") return undefined;
  const arr = Array.from(keys as Set<string>);
  return arr[0];
}

type CryptoCurrencySelectsProps = {
  tokenGroups: Record<string, tToken[]>;
  sortedSymbols: string[];
  selectedCryptoType: string | null;
  selectedBlockchain: number;
  onCryptoChange: (symbol: string) => void;
  onBlockchainChange: (chainId: number) => void;
  currencyLabel: string;
  blockchainLabel: string;
};

export function CryptoCurrencySelects({
  tokenGroups,
  sortedSymbols,
  selectedCryptoType,
  selectedBlockchain,
  onCryptoChange,
  onBlockchainChange,
  currencyLabel,
  blockchainLabel,
}: CryptoCurrencySelectsProps) {
  const currentGroup = selectedCryptoType
    ? tokenGroups[selectedCryptoType] ?? []
    : [];

  const selectedChainLabel =
    chainNames[selectedBlockchain] ?? `Chain ${selectedBlockchain}`;

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <Select
        label={currencyLabel}
        labelPlacement="inside"
        variant="bordered"
        disallowEmptySelection
        isDisabled={sortedSymbols.length === 0}
        selectedKeys={selectedCryptoType ? [selectedCryptoType] : []}
        onSelectionChange={(keys) => {
          const k = firstKey(keys);
          if (k) onCryptoChange(k);
        }}
        classNames={SELECT_CLASSNAMES}
        listboxProps={SELECT_LISTBOX_PROPS}
        popoverProps={SELECT_POPOVER_PROPS}
        renderValue={(items) => {
          const sym = (items[0]?.key as string | undefined) ?? selectedCryptoType;
          if (!sym) {
            return <span className="text-neutral-500">{currencyLabel}</span>;
          }
          const tok =
            tokenGroups[sym]?.find((t) => t.chainId === selectedBlockchain) ??
            tokenGroups[sym]?.[0];
          return (
            <div className="flex items-center gap-2">
              {tok?.tokenIcon ? (
                <img
                  src={tok.tokenIcon}
                  alt=""
                  className="h-5 w-5 shrink-0 rounded-full object-contain"
                />
              ) : (
                <span className="h-5 w-5 shrink-0 rounded-full bg-neutral-200" />
              )}
              <span className="text-black">{sym}</span>
            </div>
          );
        }}
      >
        {sortedSymbols.map((symbol) => {
          const group = tokenGroups[symbol];
          const icon = group?.[0]?.tokenIcon;
          return (
            <SelectItem key={symbol} textValue={symbol}>
              <div className="flex items-center gap-2 py-0.5">
                {icon ? (
                  <img
                    src={icon}
                    alt=""
                    className="h-5 w-5 shrink-0 rounded-full object-contain"
                  />
                ) : (
                  <span className="h-5 w-5 shrink-0 rounded-full bg-neutral-200" />
                )}
                <span className="font-medium text-neutral-900">{symbol}</span>
              </div>
            </SelectItem>
          );
        })}
      </Select>

      <Select
        label={blockchainLabel}
        labelPlacement="inside"
        variant="bordered"
        disallowEmptySelection
        isDisabled={currentGroup.length === 0}
        selectedKeys={
          currentGroup.length > 0 ? [String(selectedBlockchain)] : []
        }
        onSelectionChange={(keys) => {
          const k = firstKey(keys);
          if (k !== undefined) onBlockchainChange(Number(k));
        }}
        classNames={SELECT_CLASSNAMES}
        listboxProps={SELECT_LISTBOX_PROPS}
        popoverProps={SELECT_POPOVER_PROPS}
        renderValue={() => (
          <div className="flex items-center gap-2">
            <img
              src={getChainIconUrl(selectedBlockchain)}
              alt=""
              className="h-5 w-5 shrink-0 rounded-full object-contain"
            />
            <span className="text-black">{selectedChainLabel}</span>
          </div>
        )}
      >
        {currentGroup.map((token) => {
          const label =
            chainNames[token.chainId] ?? `Chain ${token.chainId}`;
          const iconUrl = getChainIconUrl(token.chainId);
          const chainKey = String(token.chainId);
          return (
            <SelectItem key={chainKey} textValue={label}>
              <div className="flex items-center gap-2 py-0.5">
                <img
                  src={iconUrl}
                  alt=""
                  className="h-5 w-5 shrink-0 rounded-full object-contain"
                />
                <span className="font-medium text-neutral-900">{label}</span>
              </div>
            </SelectItem>
          );
        })}
      </Select>
    </div>
  );
}
