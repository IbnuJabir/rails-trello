import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

function Navbar() {
  return (
    <div className="w-full h-14 flex justify-between items-center  text-white px-10 border-b-[.2px] border-gray-700 ">
      <h2>Rails</h2>
      <h2>Boards</h2>
      <Link href="signup">
        <Button className="bg-white text-black hover:bg-gray-300">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}

export default Navbar;
