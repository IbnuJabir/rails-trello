"use client";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import Test from "@/components/test";
import { Input } from "@/components/ui/input";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { FlipWords } from "@/components/ui/flip-words";
import { Vortex } from "@/components/ui/vortex";
import Navbar from "@/components/navbar";
import BoxReveal from "@/components/ui/box-reveal";

export default function Home() {
  // const users = await prisma.user.findMany({
  //   //exclude password
  //   select: {
  //     id: true,
  //     name: true,
  //     email: true,
  //     image: true,
  //   },
  // });
  // const userCont = await prisma.user.count();
  // // console.log("users", users);
  // console.log("Total Number of Users", userCont);

  // const session = await getSession();
  // const user = session?.user;
  // if (!user) redirect("/login?callbackUrl=/");
  const words = ["organized", "productive", "collaborative", "streamlined"];
  return (
    <div className=" text-white bg-gray-950 font-sans h-full w-full">
      <Navbar />
      <BackgroundBeamsWithCollision>
        <Vortex
          // backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={120}
          className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
        >
          <main className="flex flex-col gap-8 items-center justify-center">
            {/* <h1 className="text-4xl font-bold text-center font-montserrat sm:text-5xl">
              Rails Trello
            </h1> */}
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
            <Link href="login">
              <Button className="bg-white text-black hover:bg-gray-300">
                Get Started
              </Button>
            </Link>
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </Vortex>
      </BackgroundBeamsWithCollision>
    </div>
  );
  // return (
  //   <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
  //     <Test />
  //     <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
  //       <h1 className="text-4xl font-bold text-center sm:text-5xl">
  //         Users ({users.length})
  //       </h1>
  //       {users.map((user) => (
  //         <li key={user.id}>{user.name}</li>
  //       ))}
  //     </main>
  //     <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
  //       <form
  //         action={async () => {
  //           "use server";
  //           await signOut();
  //         }}
  //       >
  //         <Input type="hidden" name="csrfToken" value="hello" />
  //         <Button type="submit" variant="outline" className="w-full">
  //           LogOut here
  //         </Button>
  //       </form>
  //     </footer>
  //   </div>
  // );
}
