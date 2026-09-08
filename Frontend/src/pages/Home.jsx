import React from "react";
import Navbar from "../components/Navbar";
import MidHome from "@/components/MidHome";

const Home = () => {
  return (
    <div>
      <Navbar />

      <div className="flex gap-7 dark:bg-[#1b1b1c] bg-[#f2f4f7]">
        <MidHome />
      </div>
    </div>
  );
};

export default Home;