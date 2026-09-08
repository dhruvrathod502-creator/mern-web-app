import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import unfollow from "../assets/unfollow.png";
import userLogo from "../assets/emptyUser.webp";

const FriendsPage = () => {
  const { user, userProfile } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFriends = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:9000/api/v1/auth/request/list",
          {
            withCredentials: true,
          },
        );

        if (res.data.success) {
          setFriends(res.data.friends || []);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to get friends");
      } finally {
        setLoading(false);
      }
    };

    getFriends();
  }, []);

  const handleUnfriend = async (friendId) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/request/unfriend/${friendId}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success("Friend removed");

        setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to unfriend");
    }
  };

  return (
    <div className="flex max-w-6xl mx-auto gap-5 md:pb-5 pb-2 md:px-10 px-2">
      <div className="bg-white dark:bg-[#262829] w-full p-5 rounded-lg mt-2 md:mt-5">
        <h1 className="font-semibold text-xl mb-5">Friends</h1>

        {loading ? (
          <p className="text-gray-500">Loading friends...</p>
        ) : friends.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-3 rounded-2xl">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="flex justify-between items-center border rounded-2xl p-4"
              >
                <div className="flex gap-4 items-center">
                  <img
                    onClick={() => navigate(`/profile/${friend._id}/post`)}
                    src={friend.profilePicture || userLogo}
                    alt={`${friend.firstname || ""} ${friend.lastname || ""}`}
                    className="aspect-square rounded-xl w-20 h-20 object-cover cursor-pointer"
                  />

                  <h1
                    onClick={() => navigate(`/profile/${friend._id}/post`)}
                    className="font-semibold cursor-pointer"
                  >
                    {friend.firstname} {friend.lastname}
                  </h1>
                </div>

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

                    {user?._id === userProfile?._id && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleUnfriend(friend._id)}
                      >
                        <FiUserX className="mr-2" />
                        Unfriend
                      </DropdownMenuItem>
                    )}
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
