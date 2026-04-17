import { useState } from "preact/hooks";
import { ChevronDown, ChevronUp } from "lucide-preact";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

interface ExpandableCardProps {
  title: string;
  children?: preact.ComponentChildren;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showIcon?: boolean;
  icon?: preact.ComponentChildren;
  onToggle?: (expanded: boolean) => void;
}

const ExpandableCard = ({
  title,
  children,
  defaultExpanded = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
  showIcon = true,
  icon,
  onToggle
}: ExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  return (
    <div className={`w-full bg-[var(--background-secondary)] border border-[var(--highlight-background)] rounded-sm overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-4 bg-[var(--bar-background-color)] hover:bg-[var(--bar-background-color-hover)] transition-all duration-300 ${headerClassName}`}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="flex items-center">{icon}</div>}
          <span className="text-[var(--foreground)] text-[16px] font-medium">
            {title}
          </span>
        </div>
        {showIcon && (
          <div className="flex items-center text-[var(--foreground)] transition-transform duration-300">
            {isExpanded ? (
              <ChevronUp width={20} height={20} />
            ) : (
              <ChevronDown width={20} height={20} />
            )}
          </div>
        )}
      </button>

      {
        children && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className={`p-4 border-t border-[var(--highlight-background)] ${contentClassName}`}>
              {children}
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ExpandableCard;

interface ChildTabProps {
  selected?: boolean;
  title: string;
  icon?: preact.ComponentChildren;
  onClick?: () => void;
}

const ChildTab = ({ selected = false, title, icon, onClick }: ChildTabProps) => {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const borderClass = isRTL ? "border-r-2" : "border-l-2";
  const paddingClass = isRTL ? "pr-4" : "pl-4";
  const gradientClass = isRTL 
    ? "bg-[linear-gradient(270deg,rgba(27,27,27,0.3)_0%,rgba(27,27,27,0.1)_100%)]"
    : "bg-[linear-gradient(90deg,rgba(27,27,27,0.3)_0%,rgba(27,27,27,0.1)_100%)]";
  const borderColorClass = selected 
    ? (isRTL ? "border-r-[#D80D83]" : "border-l-[#D80D83]")
    : (isRTL ? "border-r-[#FFFFFF14]" : "border-l-[#FFFFFF14]");
  
  return (
    <button 
      class={`flex flex-row items-center gap-2 ${borderClass} cursor-pointer ${selected ? `${gradientClass} ${borderColorClass} text-white` : `${borderColorClass} text-[#FFFFFF89] hover:text-[#FFFFFF] transition-all duration-300`} ${paddingClass} py-2`} 
      onClick={onClick}
    >
      {icon && <div className="flex items-center">{icon}</div>}
      <span className="text-[12px] leading-[200%]">{title}</span>
    </button>
  )
}

export { ChildTab };