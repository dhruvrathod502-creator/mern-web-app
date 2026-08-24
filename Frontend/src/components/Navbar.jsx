import React from "react";
import { setUser } from "@/redux/authSlice";
import {
  FaSearch,
  FaHome,
  FaUserFriends,
  FaStore,
  FaBell,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { MdLogout, MdOutlineOndemandVideo } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/themeSlice";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((store) => store.theme);
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/v1/auth/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };
  return (
    <nav className="bg-white dark:bg-[#262829] shadow fixed top-0 left-0 right-0 z-50">
      <div className="px-4 py-2 md:py-0 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-300"
            onClick={() => navigate("/")}
          />

          <div className="flex items-center bg-[#f2f4f7] dark:bg-[#323233] px-3 py-2 rounded-full">
            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search Facebook"
              className="bg-transparent ml-2 outline-none text-sm w-28 md:w-48 text-black dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Center Section */}
        <div className="hidden md:flex items-center gap-19 mt-2">
          <button
            onClick={() => navigate("/")}
            className={`w-[120px] flex items-center justify-center pb-3 transition-all ${
              location.pathname === "/"
                ? "border-b-4 border-blue-600"
                : "hover:bg-gray-200/20 rounded-lg"
            }`}
          >
            <FaHome
              className={`text-3xl ${
                location.pathname === "/" ? "text-blue-600" : "text-gray-400"
              }`}
            />
          </button>

          <button
            onClick={() => navigate("/friends")}
            className={`w-[100px] flex items-center justify-center pb-3 transition-all ${
              location.pathname === "/friends"
                ? "border-b-4 border-blue-600"
                : "hover:bg-gray-200/20 rounded-lg"
            }`}
          >
            <FaUserFriends
              className={`text-3xl ${
                location.pathname === "/friends"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            />
          </button>

          
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end space-x-4 w-[ 400px]">
          <FaBell className="hidden md:block text-xl text-gray-600 cursor-pointer hover:text-blue-600 transition-all" />

          <IoMdMenu className="hidden md:block text-2xl text-gray-600 cursor-pointer hover:text-blue-600 transition-all" />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 bg-[#262829] text-white border-none"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  Friends
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="bg-[#3a3c3d] p-2 rounded-full">
                  {theme === "light" ? (
                    <FaMoon className="text-gray-200" />
                  ) : (
                    <FaSun className="text-gray-200" />
                  )}
                </div>
                <span>Display</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={logoutHandler}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="bg-[#3a3c3d] p-2 rounded-full">
                  <MdLogout className="text-gray-200 text-lg" />
                </div>
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
