import { FunctionalComponent } from "preact";

interface PaymentCardProps {
  title: string;
  image: string;
  logoOnly?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const PaymentCard: FunctionalComponent<PaymentCardProps> = ({
  title,
  image,
  logoOnly = true,
  selected = false,
  onSelect,
}) => {
  return (
    <div
      className={`flex flex-col items-center min-w-[120px] cursor-pointer justify-center rounded-md px-5 ${
        selected ? "border border-[#FFFFFF33] bg-[#FFFFFF40]" : "bg-[#FFFFFF1A]"
      }`}
      onClick={onSelect}
    >
      <div className="shadow-[inset_0_-1px_0_0_#1B1B1B] py-3 max-w-[80px]">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          src={image}
          alt={title}
          className={`w-full object-cover grayscale ${
            selected ? "brightness-200 invert" : ""
          }`}
        />
      </div>
      {!logoOnly && (
        <span className="border-t border-[#1B1B1B] py-3 text-[12px] text-[#FFFFFFCC]">
          {title}
        </span>
      )}
    </div>
  );
};

export default PaymentCard;
