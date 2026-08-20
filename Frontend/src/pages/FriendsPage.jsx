import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import unfollow from "../assets/unfollow.png";
import userLogo from "../assets/emptyUser.webp";

const FriendsPage = () => {
  const { userProfile } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const friends = userProfile?.friends || [];

  return (
    <div className="flex max-w-6xl mx-auto gap-5 md:pb-5 pb-2 md:px-10 px-2">
      <div className="bg-white dark:bg-[#262829] w-full p-5 rounded-lg mt-2 md:mt-5">
        
        <h1 className="font-semibold text-xl mb-5">
          Friends
        </h1>

        {friends.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-3 rounded-2xl">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="flex justify-between items-center border rounded-2xl p-4"
              >
                {/* Friend Info */}
                <div className="flex gap-4 items-center">
                  <img
                    onClick={() =>
                      navigate(`/profile/${friend._id}/post`)
                    }
                    src={friend.profilePicture || userLogo}
                    alt={`${friend.firstname} ${friend.lastname}`}
                    className="aspect-square rounded-xl w-20 h-20 object-cover cursor-pointer"
                  />

                  <h1 className="font-semibold">
                    {friend.firstname} {friend.lastname}
                  </h1>
                </div>

                {/* Three Dots Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#333]">
                      <BsThreeDots size={20} />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-[200px]" align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <img
                        src={unfollow}
                        alt="Unfollow"
                        className="h-4 w-4 mr-2"
                      />
                      Unfollow
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer">
                      <FiUserX className="mr-2" />
                      Unfriend
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h1 className="text-gray-800 dark:text-gray-300">
              You have no friends to show
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;