import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
     <Image
        src="/banner.png"
        alt="logo"
        width={500} 
        height={250} 
        style={{ width: "100%", height: "auto" }}
        />
    </div>
  );
}
