import React from "react";
import notfound from "@/assets/not-found.webp";
import Image from "next/image";
export default function Notfound() {
  return (
    <div className="w-full h-[100svh] p-4 flex flex-col items-center justify-center relative z-10">
      <Image
        src={notfound}
        alt="background"
        fill
        className="object-cover -z-50"
      />
    </div>
  );
}
