import { cn } from "@/lib/utils";

import Flower from "@/public/flower-lotus.svg";

function Logo() {
  return (
    <div className={cn("flex items-center gap-[2px] justify-center")}>
      <Flower className="w-6 h-6 text-[#141a46] mb-1" />
      <div className="flex items-center h-full">
        <h1 className={cn("text-3xl font-cousine h-full")}>
          <span className="leading-0 tracking-tighter">flower</span>
          <span className="leading-0 tracking-tighter">head</span>
        </h1>
      </div>
    </div>
  );
}

export default Logo;
