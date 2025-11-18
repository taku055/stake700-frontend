import { useState } from "preact/hooks";
import { ChevronDown, ChevronUp } from "lucide-preact";;

interface MessageBoxProps {
  title: string;
  children?: preact.ComponentChildren;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showIcon?: boolean;
  icon?: preact.ComponentChildren;
  onToggle?: (expanded: boolean) => void;
  receivedAt?: string;
}

const MessageBox = ({
  title,
  children,
  defaultExpanded = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
  showIcon = true,
  icon,
  onToggle,
  receivedAt
}: MessageBoxProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  return (
    <div className={`w-full ${isExpanded ? "bg-[#FFFFFF0D]" : "bg-[#FFFFFF33]"} rounded-sm overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="p-2">
        {icon && <div className="flex items-center">{icon}</div>}
        {title}
      </div>

      {
        children && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className={`p-4 ${contentClassName}`}>
              {children}
            </div>
          </div>
        )
      }
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-2 bg-[#FFFFFF0D] hover:bg-[var(--bar-background-color-hover)] transition-all duration-300 ${headerClassName}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-[var(--foreground)] text-[16px] font-medium">
            {receivedAt}
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
    </div>
  );
};

export default MessageBox;