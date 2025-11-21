import { ComponentChildren } from "preact";

interface GuideCardProps {
  icon: string;
  title: string;
  content: ComponentChildren;
  className?: string;
}

export default function GuideCard({
  icon,
  title,
  content,
  className = "",
}: GuideCardProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {icon && (
        <div className="flex items-center justify-center">
          <img src={icon} alt={title} className="w-14 h-14" />
        </div>
      )}
      {title && (
        <h3 className="text-[var(--primary-color)] md:w-[70%] text-[22px] font-semibold text-center">
          {title}
        </h3>
      )}
      {content && (
        <div className="text-[var(--passive-color)] text-[16px] text-center">
          {content}
        </div>
      )}
    </div>
  );
}

