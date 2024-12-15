"use client";
import { trpc } from "@/server/client";
import React from "react";
import { toast } from "react-toastify";

function Test() {
  const { data, error, isLoading } = trpc.user.getUsers.useQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    toast.error(error.message);
  }
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1 className="text-4xl font-bold text-center sm:text-5xl">
        Users ({data?.length})
      </h1>
      {data?.map((user) => <li key={user.id}>{user.name}</li>)}
    </main>
  );
}

export default Test;
