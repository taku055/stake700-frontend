import { FaArrowLeft } from "react-icons/fa";
import { Link } from "./common";

export default function BackButton({ href }: { href: string }) {
  return (
    <Link href={href} className="w-[32px] h-[32px] flex items-center justify-center bg-[#fff2] rounded-full">
      <FaArrowLeft />
    </Link>
  );
}
