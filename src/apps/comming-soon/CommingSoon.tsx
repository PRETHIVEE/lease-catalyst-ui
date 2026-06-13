import { ClipboardClock } from "lucide-react";

const CommingSoon = () => {
  return (
    <div className="p-10">
      <p className="flex gap-2 text-[1.5rem]">
        <ClipboardClock  size={32}/>
        Comming Soon
      </p>
    </div>
  );
};

export default CommingSoon;
