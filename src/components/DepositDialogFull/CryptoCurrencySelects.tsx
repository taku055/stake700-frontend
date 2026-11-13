import { Select, SelectItem } from "@heroui/react";
import { chainNames, getChainIconUrl } from "@/config/chains";
import type { tToken } from "@/types/tToken";

const SELECT_CLASSNAMES = {
  base: "w-full",
  trigger:
    "rounded-md! bg-[#0f212e]! border border-[#2f4553] min-h-[52px] h-auto py-1.5 data-[hover=true]:bg-[#213743]!",
  value: "text-white! text-sm font-medium gap-2",
  label:
    "text-[#b1bad3]! group-data-[filled=true]:text-[#b1bad3]! font-normal text-xs",
  listboxWrapper: "max-h-[280px] !bg-[#0f212e] bg-[#0f212e]",
  listbox: "!bg-[#0f212e] bg-[#0f212e] p-0",
  popoverContent:
    "!bg-[#0f212e] bg-[#0f212e] rounded-md border border-[#2f4553] shadow-lg p-0 overflow-hidden",
} as const;

const SELECT_POPOVER_PROPS = {
  shouldCloseOnScroll: false,
  shouldBlockScroll: true,
  classNames: {
    content:
      "!bg-[#0f212e] bg-[#0f212e] rounded-md border border-[#2f4553] shadow-lg p-0 overflow-hidden",
  },
} as const;

const SELECT_LISTBOX_PROPS = {
  classNames: {
    base: "!bg-[#0f212e] bg-[#0f212e] p-0 min-w-[var(--trigger-width)]",
  },
  itemClasses: {
    base:
      "!bg-transparent text-white data-[hover=true]:!bg-[#213743] data-[selectable=true]:focus:!bg-[#213743] data-[pressed=true]:!bg-[#213743]",
    title: "text-white",
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
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
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
            return <span className="text-[#b1bad3]">{currencyLabel}</span>;
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
                <span className="h-5 w-5 shrink-0 rounded-full bg-[#2f4553]" />
              )}
              <span className="text-white">{sym}</span>
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
                  <span className="h-5 w-5 shrink-0 rounded-full bg-[#2f4553]" />
                )}
                <span className="font-medium text-white">{symbol}</span>
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
            <span className="text-white">{selectedChainLabel}</span>
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
                <span className="font-medium text-white">{label}</span>
              </div>
            </SelectItem>
          );
        })}
      </Select>
    </div>
  );
}
