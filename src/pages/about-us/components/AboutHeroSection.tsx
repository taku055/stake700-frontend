import { useState } from "preact/hooks";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";

interface AboutHeroSectionProps {
  desktopImage: string;
  mobileImage: string;
  title: string;
  content: string;
}

export default function AboutHeroSection({
  desktopImage,
  mobileImage,
  title,
  content,
}: AboutHeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const imageSrc = isMobile ? mobileImage : desktopImage;

  // On mobile, show content by default; on desktop, show on hover
  const shouldShowContent = isMobile ? true : isHovered;

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-auto object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 transition-all duration-300">
        <h1 className="text-[var(--primary-color)] text-3xl md:text-5xl font-bold mb-4 text-center px-4">
          {title}
        </h1>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            shouldShowContent
              ? "max-h-[200px] opacity-100 mt-4"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <p className="text-white text-[12px] md:text-[22px] text-center px-4 max-w-4xl">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

