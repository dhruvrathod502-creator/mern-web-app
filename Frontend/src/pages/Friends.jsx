import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUserX, FiUsers, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setUserProfile } from "@/redux/authSlice";
import userLogo from "../assets/emptyUser.webp";

const Friends = () => {
  const [allRequest, setAllRequest] = useState([]);
  const [friends, setFriends] = useState([]);
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState([]);

  const { user, userProfile } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ================= GET FRIENDS + REQUESTS =================
  const getFriendRequest = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9000/api/v1/auth/request/list",
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setAllRequest(res.data.requests || []);
        setFriends(res.data.friends || []);
      }
    } catch (error) {
      console.log("Get friends error:", error);
    }
  };

  // ================= ACCEPT FRIEND REQUEST =================
  const acceptFriendRequest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/request/accept/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        if (res.data.user) {
          dispatch(setUser(res.data.user));
        }

        if (res.data.userProfile) {
          dispatch(setUserProfile(res.data.userProfile));
        }

        setAllRequest((prev) => prev.filter((request) => request._id !== id));

        getFriendRequest();

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Accept request error:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ================= SEND FRIEND REQUEST =================
  const sendFriendRequest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/request/send/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        if (res.data.user) {
          dispatch(setUser(res.data.user));
        }

        if (res.data.userProfile) {
          dispatch(setUserProfile(res.data.userProfile));
        }

        setPeopleYouMayKnow((prev) =>
          prev.filter((person) => person._id !== id),
        );

        toast.success(res.data.message);

        getFriendRequest();
      }
    } catch (error) {
      console.log("Send friend request error:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ================= REJECT FRIEND REQUEST =================
  const rejectFriendRequest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/request/reject/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        if (res.data.user) {
          dispatch(setUser(res.data.user));
        }

        if (res.data.userProfile) {
          dispatch(setUserProfile(res.data.userProfile));
        }

        setAllRequest((prev) => prev.filter((request) => request._id !== id));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Reject request error:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    getFriendRequest();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a]">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="mx-auto w-full max-w-[1150px] px-4 pb-20 pt-24 md:px-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Friends
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your friends, friend requests and discover new people.
          </p>
        </div>

        {/* ================= YOUR FRIENDS ================= */}
        <section className="rounded-2xl bg-white p-5 shadow-sm dark:bg-[#242526] md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FiUsers className="h-6 w-6 text-[#0866ff]" />

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Friends
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {friends.length} {friends.length === 1 ? "friend" : "friends"}
              </p>
            </div>
          </div>

          {friends.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-[#242526]"
                >
                  <div className="overflow-hidden">
                    <img
                      src={friend.profilePicture || userLogo}
                      onClick={() => navigate(`/profile/${friend._id}/post`)}
                      alt={`${friend.firstname} ${friend.lastname}`}
                      className="aspect-square w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3 md:p-4">
                    <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">
                      {friend.firstname} {friend.lastname}
                    </h3>

                    <p className="mb-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Friend
                    </p>

                    <Button
                      onClick={() => navigate(`/profile/${friend._id}/post`)}
                      className="h-10 w-full rounded-lg bg-[#e7f3ff] font-semibold text-[#0866ff] hover:bg-[#dbeeff] dark:bg-[#263951] dark:text-[#5aa7ff] dark:hover:bg-[#304866]"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[230px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 text-center dark:border-gray-700">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-[#3a3b3c]">
                <FiUserX className="h-8 w-8 text-gray-500" />
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                No friends yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Add people and accept friend requests to see your friends here.
              </p>
            </div>
          )}
        </section>

        {/* ================= FRIEND REQUEST ================= */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm dark:bg-[#242526] md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FiUserPlus className="h-6 w-6 text-[#0866ff]" />

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Friend Requests
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {allRequest.length} pending{" "}
                {allRequest.length === 1 ? "request" : "requests"}
              </p>
            </div>
          </div>

          {allRequest.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {allRequest.map((friend) => (
                <div
                  key={friend._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-[#242526]"
                >
                  <div className="overflow-hidden">
                    <img
                      src={friend.profilePicture || userLogo}
                      onClick={() => navigate(`/profile/${friend._id}/post`)}
                      alt={`${friend.firstname} ${friend.lastname}`}
                      className="aspect-square w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3 md:p-4">
                    <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">
                      {friend.firstname} {friend.lastname}
                    </h3>

                    <p className="mb-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Wants to be your friend
                    </p>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => acceptFriendRequest(friend._id)}
                        className="h-10 w-full rounded-lg bg-[#0866ff] font-semibold text-white hover:bg-[#075ce5]"
                      >
                        Confirm
                      </Button>

                      <Button
                        onClick={() => rejectFriendRequest(friend._id)}
                        className="h-10 w-full rounded-lg bg-gray-200 font-semibold text-gray-800 hover:bg-gray-300 dark:bg-[#3a3b3c] dark:text-white dark:hover:bg-[#4e4f50]"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[230px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 text-center dark:border-gray-700">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-[#3a3b3c]">
                <FiUserX className="h-8 w-8 text-gray-500" />
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                No friend requests
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                You're all caught up! New friend requests will appear here.
              </p>
            </div>
          )}
        </section>

        
      </main>
    </div>
  );
};

export default Friends;
