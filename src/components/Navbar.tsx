import React from "react";
import Image from "next/image";
import LogOutButton from "./LogOutButton";

export default function Navbar() {
  return (
    <nav className="relative flex w-full flex-wrap items-center justify-between bg-zinc-50 py-2 shadow-dark-mild lg:py-4 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
      <div className="flex w-full flex-wrap items-center justify-between px-3">
        <div className="ms-2 flex items-center">
          <Image
            src="/linkErase.png"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 mr-3"
          />
          <span className="text-xl font-medium text-black">List Erase</span>
        </div>
        <div>
          <LogOutButton />
        </div>
      </div>
    </nav>
  );
}
