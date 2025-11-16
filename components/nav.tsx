"use client";

import { UseIsScrollTop } from "@/hooks/use-is-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./logo";

const Nav = () => {
  const { isTop } = UseIsScrollTop();

  return (
    <nav
      className={cn(
        "fixed  bg-gray-200 w-full py-6 transition-all duration-500 backdrop-blur-2xl -translate-y-20 left-1/2 -translate-x-1/2",
        isTop ? "opacity-100 translate-y-0" : "opacity-0"
      )}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-start w-full">
        <Logo logoText={["Uni", "Phi"]} icon="car" />
        {/* <div>
        <Link href="scheduler">Scheduler</Link>
      </div> */}
        {/* <div className="hover:-translate-y-10 transition-all duration-500 ">
        <a
          href="mailto:flowerhead.dev@gmail.com?subject=I%20have%20a%20project%20I'd%20like%20help%20with"
          className=" text-primary/80 hover:text-gray-400 transition-al duration-300  flex justify-center items-center gap-2 "
        >
          <span>Contact</span>[
          <Mail size={24} />]
        </a>
      </div> */}
      </div>
    </nav>
  );
};

export default Nav;
