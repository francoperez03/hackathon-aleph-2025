import { ArrowLeft } from "lucide-react";

interface Props {
  onBack: () => void;
}

export default function ConnectionHeader({ onBack }: Props) {
  return (
    <button
      className="absolute top-6 left-6 flex items-center text-primary hover:text-[#0077b3] transition"
      onClick={onBack}
    >
      <ArrowLeft className="h-6 w-6" />
    </button>
  );
}
