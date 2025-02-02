import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
     <Image
        src="/banner.png"
        alt="logo"
        width={500} // Example width in pixels
        height={250} // Adjust height for aspect ratio
        style={{ width: "100%", height: "auto" }}
        // priority={true} 
        // style={{ height: "auto" }}
        // loading="eager"
        />
    </div>
  );
}
