"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { FlipWords } from "@/components/ui/flip-words";
import { Vortex } from "@/components/ui/vortex";
import BoxReveal from "@/components/ui/box-reveal";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  const user = session.data?.user;
  const words = ["organized", "productive", "collaborative", "streamlined"];
  return (
    <div className=" text-white bg-gray-950 font-sans h-full w-full">
      <BackgroundBeamsWithCollision>
        <Vortex
          rangeY={800}
          particleCount={500}
          baseHue={120}
          className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
        >
          <main className="flex flex-col gap-8 items-center justify-center pl-4 md:pl-0">
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <h1 className="text-[3.5rem] font-semibold font-montserrat">
                Rails Trello<span className="text-[#5046e6]">.</span>
              </h1>
            </BoxReveal>
            <div className="text-4xl mx-auto font-ubuntu">
              Empower Your
              <FlipWords words={words} /> <br />
              Workflow with Our Boards
            </div>
            {user ? (
              <Link href="/boards">
                <Button className="bg-white text-black hover:bg-gray-300">
                  Go to Boards
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="bg-white text-black hover:bg-gray-300">
                  Get Started
                </Button>
              </Link>
            )}
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </Vortex>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
