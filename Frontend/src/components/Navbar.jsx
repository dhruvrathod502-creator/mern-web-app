import React, { useState } from "react";
import { setUser } from "@/redux/authSlice";
import {
  FaSearch,
  FaHome,
  FaUserFriends,
  FaBell,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";
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
  const location = useLocation();

  const { theme } = useSelector((store) => store.theme);
  const { user } = useSelector((store) => store.auth);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGOUT
  // =========================
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

  // SEARCH USER

  const searchHandler = async (e) => {
    const value = e.target.value;

    setSearch(value);

    // Empty search
    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:9000/api/v1/auth/search?search=${encodeURIComponent(
          value,
        )}`,
        {
          withCredentials: true,
        },
      );

      console.log("SEARCH RESPONSE:", res.data);

      setUsers(res.data.users || []);
    } catch (error) {
      console.log("SEARCH ERROR:", error);

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-[#262829] shadow fixed top-0 left-0 right-0 z-50">
      <div className="px-4 py-2 md:py-0 flex justify-between items-center">
        {/* LEFT SECTION */}

        <div className="flex items-center space-x-3">
          {/* LOGO */}
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-300"
            onClick={() => navigate("/")}
          />

          {/* ========================= */}
          {/* SEARCH */}
          {/* ========================= */}

          <div className="relative">
            <div className="flex items-center bg-[#f2f4f7] dark:bg-[#323233] px-3 py-2 rounded-full">
              {/* ONLY ONE SEARCH ICON */}
              <FaSearch className="text-gray-400" />

              <input
                type="text"
                placeholder="Search Friend"
                value={search}
                onChange={searchHandler}
                className="bg-transparent ml-2 outline-none text-sm w-28 md:w-48 text-black dark:text-white placeholder-gray-500"
              />
            </div>

            {/* ========================= */}
            {/* SEARCH RESULTS */}
            {/* ========================= */}

            {search.trim() && (
              <div className="absolute top-12 left-0 w-72 bg-white dark:bg-[#262829] shadow-lg rounded-lg overflow-hidden z-50">
                {/* LOADING */}
                {loading && (
                  <p className="p-3 text-sm text-gray-500 dark:text-gray-300">
                    Searching...
                  </p>
                )}

                {/* NO USERS */}
                {!loading && users.length === 0 && (
                  <p className="p-3 text-sm text-gray-500 dark:text-gray-300">
                    No users found
                  </p>
                )}

                {/* USERS */}
                {!loading &&
                  users.map((user) => {
                    // Get user's name
                    const userName =
                      `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
                      "Unknown User";

                    return (
                      <div
                        key={user._id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setSearch("");
                          setUsers([]);
                          navigate(`/profile/${user._id}`);
                        }}
                      >
                        {/* PROFILE IMAGE */}
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={
                              user.profilePicture ||
                              user.profilePic ||
                              user.avatar ||
                              ""
                            }
                            alt={userName}
                          />

                          <AvatarFallback>
                            {userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {/* USER NAME */}
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-black dark:text-white">
                            {userName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        
        {/* CENTER SECTION */}
        

        <div className="hidden md:flex items-center gap-19 mt-2">
          {/* HOME */}
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

          {/* FRIENDS */}
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

        
        {/* RIGHT SECTION */}
        

        <div className="flex items-center justify-end space-x-4 w-[400px]">
          

          {/* PROFILE DROPDOWN */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profilePicture || "/user.jpg"}
                    alt={`${user?.firstname || ""} ${user?.lastname || ""}`}
                  />
                  <AvatarFallback>
                    {user?.firstname?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 bg-[#262829] text-white border-none"
            >
              {/* ACCOUNT */}
              <DropdownMenuGroup>
                
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              {/* LOGOUT */}
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
