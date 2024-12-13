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

export default async function Home() {
  const users = await prisma.user.findMany({
    //exclude password
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });
  const userCont = await prisma.user.count();
  // console.log("users", users);
  console.log("Total Number of Users", userCont);

  const session = await getSession();
  const user = session?.user;
  // if (!user) redirect("/login?callbackUrl=/");
  if (!user) {
    return (
      <BackgroundBeamsWithCollision>
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold text-center sm:text-5xl">
              Please Login to view Users
            </h1>
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            <Link href="login" className="underline">
              LogIn
            </Link>
          </footer>
        </div>
      </BackgroundBeamsWithCollision>
    );
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Test />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-5xl">
          Users ({users.length})
        </h1>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Input type="hidden" name="csrfToken" value="hello" />
          <Button type="submit" variant="outline" className="w-full">
            LogOut here
          </Button>
        </form>
      </footer>
    </div>
  );
}
