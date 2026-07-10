import { HelpCircle } from "lucide-preact";
import { useId, useState } from "preact/hooks";

type CvvTooltipProps = {
  text: string;
};

export function CvvTooltip({ text }: CvvTooltipProps) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className="rounded-full p-0.5 text-[#94A3B8] transition-colors duration-200 hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C16A]/40"
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        <HelpCircle className="h-4 w-4" aria-hidden />
        <span className="sr-only">{text}</span>
      </button>
      {visible ? (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full right-0 z-20 mb-2 w-52 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#131B2C] px-3 py-2 text-xs leading-relaxed text-[#F8FAFC] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          {text}
        </div>
      ) : null}
    </div>
  );
}
