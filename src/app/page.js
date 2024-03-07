"use client";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen grid place-items-center ">
      <Link
        href="/carton"
        className="bg-blue-500 text-3xl rounded-md text-white mx-auto py-6 px-10 hover:scale-110 transition-all"
      >
        Voir le carton
      </Link>
    </div>
  );
}
