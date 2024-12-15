import Loader from "@/components/loader";
import React from "react";

function LoadingPage() {
  return (
    <div className="w-full h-screen p-4 flex flex-col items-center justify-center relative z-10">
      <Loader color="#000" height={30} width={6} />
    </div>
  );
}

export default LoadingPage;
