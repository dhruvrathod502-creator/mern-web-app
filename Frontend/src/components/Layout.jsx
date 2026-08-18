import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#f2f4f7] dark:bg-[#18191a]">
      <Sidebar />

      <main className="ml-[320px] mr-[350px] pt-16 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;