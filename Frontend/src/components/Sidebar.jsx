import React from "react";
import {
  FaHome,
  FaUserFriends,
  FaVideo,
  FaStore,
  FaBell,
  FaBars,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import friends from "../assets/friend.png";
import dashboard from "../assets/dashboard.png";
import store from "../assets/marketplace.png";
import group from "../assets/groups.png";
import meta from "../assets/meta.png";
import feeds from "../assets/feeds.png";
import reels from "../assets/reels.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import userLogo from "../assets/user.jpg";

const menuItems = [
  {
    icon: meta,
    label: "Meta AI",
    click:
      "https://www.meta.ai/?utm_source=facebook_bookmarks&fbclid=IwY2xjawKxAphleHRuA2FlbQIxMABicmlkETFUSEdaZXFqYUxOTlg1S3dyAR6Muvyg4hACJ2WPFp8hB4kbng8eThxPA9w-kU1RLCLIim0dPOjM7_hXBs8O2A_aem_phGQiaSAJWF3ZNZ9s3JQOQ",
  },
  { icon: friends, label: "Friends", click: "/friends" },
  { icon: dashboard, label: "Professional dashboard" },
  { icon: feeds, label: "Feeds" },
  { icon: group, label: "Groups" },
  { icon: store, label: "Marketplace" },
  { icon: reels, label: "Reels" },
  // { icon: <FaBell />, label: 'Notifications' },
];

const Sidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="dark:bg-[#1b1b1c] bg-[#f2f4f7] text-black dark:text-gray-300 h-screen px-1  p-4 w-80 hidden md:block fixed top-0 left-0 mt-12 ">
      {/* Top Logo */}
      <Link to={`/profile/${user._id}/post`}>
        <div className="flex items-center cursor-pointer gap-4 mt-2 hover:bg-gray-200 px-3 py-2 rounded-lg dark:hover:bg-[#323233]">
          <Avatar>
            <AvatarImage src={user.profilePicture || userLogo} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-semibold">{user?.firstname} {user?.lastname}</h1>
        </div>
      </Link>

      {/* menu */}

      <div className="flex flex-col">
        {menuItems.map((item) => (
          <Link key={item.label} to={item.click || "#"}>
            <div className="flex items-center gap-4 dark:text-gray-700 text-black hover:bg-gray-200 dark:hover:bg-[#323233] px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200">
              <img src={item.icon} alt={item.label} className="w-10 h-10" />
              <span className="font-semibold dark:text-gray-300 text-black">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <p className="absolute font-semibold bottom-16 pl-2 text-sm text-gray-400">
        Privacy . Terms . Advertising . Ad choice . Cookies . . Meta © 2026{" "}
      </p>
    </div>
  );
};

export default Sidebar;
