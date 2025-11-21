interface AboutCardProps {
  image: string;
  title: string;
  explanation: string;
}

export default function AboutCard({
  image,
  title,
  explanation,
}: AboutCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-lg">
      <img
        src={image}
        alt={title}
        className="w-[80%] h-auto object-cover rounded-md"
      />
      <div className="flex flex-col gap-2 text-center">
        <h3 className="text-[var(--primary-color)] text-[22px] font-semibold">
          {title}
        </h3>
        {/* <p className="text-[var(--passive-color)] text-base">
          {explanation}
        </p> */}
      </div>
    </div>
  );
}

