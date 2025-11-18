import { abbr } from "@/helpers/abbr";
import { Check, CheckCheck, Copy } from "lucide-preact";
import { toast } from "@/helpers/toast";
import { useState, useEffect } from "preact/hooks";

interface ITextWithCopyProps {
  text: string;
}

export default function TextWithCopy({ text }: ITextWithCopyProps) {
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  }, [isCopied]);
  return (
    <div className="flex text-slate-500 items-center gap-1">
      {abbr(text, 5)}
      <button
        onClick={(e) => {
          navigator.clipboard.writeText(text);
          toast.info("Copied " + text);
          setIsCopied(true);
          e.stopPropagation();
        }}
      >
        {!isCopied ? (
          <Copy size={15} className="text-white" />
        ) : (
          <Check size={15} className="text-white" />
        )}
      </button>
    </div>
  );
}
