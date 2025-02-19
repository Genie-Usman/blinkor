import React from "react";
import Image from "next/image";
import Slider from '../components/Slider'

export default function Home() {
  return (
    <>
    <Slider/>
    <div className="mt-20 md:mt-16">
     <Image
        src="/banner.png"
        alt="logo"
        width={500} 
        height={250} 
        style={{ width: "100%", height: "auto" }}
        />
    </div>
    </>
  );
}
