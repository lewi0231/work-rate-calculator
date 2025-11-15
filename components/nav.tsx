"use client";

import { UseIsScrollTop } from "@/hooks/use-is-scroll-top";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";

const Nav = () => {
  const { isTop } = UseIsScrollTop();

  return (
    <nav
      className={cn(
        "fixed w-full flex items-center justify-between px-10 py-8   transition-all duration-500 backdrop-blur-2xl -translate-y-20",
        isTop ? "opacity-100 translate-y-0" : "opacity-0"
      )}
    >
      <Logo />
      <div>
        <Link href="scheduler">Scheduler</Link>
      </div>
      <div>
        <a
          href="mailto:flowerhead.dev@gmail.com?subject=I%20have%20a%20project%20I'd%20like%20help%20with"
          className=" hover:text-gray-400"
        >
          <Mail />
        </a>
      </div>
    </nav>
  );
};

export default Nav;
