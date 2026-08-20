import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUserX } from "react-icons/fi";
import userLogo from "../assets/emptyUser.webp";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setUserProfile } from "@/redux/authSlice";

const Friends = () => {
  const [allRequest, setAllRequest] = useState([]);
  const [friends, setFriends] = useState([]);
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState([]);

  const { user, userProfile } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =========================
  // GET FRIENDS + REQUESTS
  // =========================
  const getFriendRequest = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9000/api/v1/auth/request/list",
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setAllRequest(res.data.requests || []);
        setFriends(res.data.friends || []);
      }
    } catch (error) {
      console.log("Get friends error:", error);
    }
  };

  // =========================
  // GET PEOPLE YOU MAY KNOW
  // =========================
  const getPeopleYouMayKnow = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9000/api/v1/auth/suggestions",
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setPeopleYouMayKnow(res.data.suggestions || []);
      }
    } catch (error) {
      console.log("Get suggestions error:", error);
    }
  };

  // =========================
  // ACCEPT FRIEND REQUEST
  // =========================
  const acceptFriendRequest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/request/accept/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // Update Redux only if backend sends these
        if (res.data.user) {
          dispatch(setUser(res.data.user));
        }

        if (res.data.userProfile) {
          dispatch(setUserProfile(res.data.userProfile));
        }

        // Remove request immediately
        setAllRequest((prev) =>
          prev.filter((request) => request._id !== id)
        );

        // Reload friends
        getFriendRequest();

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Accept request error:", error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  // =========================
  // SEND FRIEND REQUEST
  // =========================
  const sendFriendRequest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/request/send/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        if (res.data.user) {
          dispatch(setUser(res.data.user));
        }

        if (res.data.userProfile) {
          dispatch(setUserProfile(res.data.userProfile));
        }

        // Remove from suggestions
        setPeopleYouMayKnow((prev) =>
          prev.filter((person) => person._id !== id)
        );

        toast.success(res.data.message);

        // Reload data
        getFriendRequest();
      }
    } catch (error) {
      console.log("Send friend request error:", error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  // =========================
  // REJECT FRIEND REQUEST
  // =========================
  const rejectFriendRequest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/request/reject/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        if (res.data.user) {
          dispatch(setUser(res.data.user));
        }

        if (res.data.userProfile) {
          dispatch(setUserProfile(res.data.userProfile));
        }

        setAllRequest((prev) =>
          prev.filter((request) => request._id !== id)
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Reject request error:", error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    getFriendRequest();
    getPeopleYouMayKnow();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="pt-20 md:pl-[350px] px-4 pb-20">

        {/* ================================================= */}
        {/* YOUR FRIENDS */}
        {/* ================================================= */}

        <h1 className="text-2xl font-semibold">
          Your Friends
        </h1>

        {friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5">

            {friends.map((friend) => (
              <div
                key={friend._id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden dark:bg-[#262829] bg-white shadow-sm"
              >

                {/* Profile Image */}

                <img
                  src={friend.profilePicture || userLogo}
                  onClick={() =>
                    navigate(`/profile/${friend._id}/post`)
                  }
                  alt=""
                  className="w-full aspect-square object-cover cursor-pointer"
                />

                {/* Details */}

                <div className="p-4 space-y-3">

                  <h1 className="font-semibold text-lg">
                    {friend.firstname} {friend.lastname}
                  </h1>

                  <Button
                    onClick={() =>
                      navigate(`/profile/${friend._id}/post`)
                    }
                    className="bg-[#e1e4e8] hover:bg-[#d8dade] text-gray-800 dark:bg-[#3b3d3e] dark:hover:bg-[#3b3d3e] dark:text-white w-full cursor-pointer"
                  >
                    View Profile
                  </Button>

                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="border p-5 mt-5 flex flex-col gap-3 items-center border-gray-200 dark:border-gray-700 rounded-2xl w-[280px] dark:bg-[#262829]">

            <FiUserX className="w-12 h-12" />

            <h1 className="text-xl font-semibold">
              No friends yet
            </h1>

            <p className="text-center text-gray-600 dark:text-gray-300">
              Add people and accept friend requests to see your
              friends here.
            </p>

          </div>
        )}

        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <hr className="my-12" />

        {/* ================================================= */}
        {/* FRIEND REQUEST */}
        {/* ================================================= */}

        <h1 className="text-2xl font-semibold">
          Friend Request
        </h1>

        {allRequest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5">

            {allRequest.map((friend) => (
              <div
                key={friend._id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden dark:bg-[#262829] bg-white shadow-sm"
              >

                {/* Profile Image */}

                <img
                  src={friend.profilePicture || userLogo}
                  onClick={() =>
                    navigate(`/profile/${friend._id}/post`)
                  }
                  alt=""
                  className="w-full aspect-square object-cover cursor-pointer"
                />

                {/* Details */}

                <div className="p-4 space-y-3">

                  <h1 className="font-semibold text-lg">
                    {friend.firstname} {friend.lastname}
                  </h1>

                  <div className="flex flex-col gap-2">

                    <Button
                      onClick={() =>
                        acceptFriendRequest(friend._id)
                      }
                      className="bg-[#0866ff] hover:bg-[#0866ff] text-white w-full cursor-pointer"
                    >
                      Confirm
                    </Button>

                    <Button
                      onClick={() =>
                        rejectFriendRequest(friend._id)
                      }
                      className="bg-[#e1e4e8] hover:bg-[#d8dade] text-gray-800 dark:bg-[#3b3d3e] dark:hover:bg-[#3b3d3e] dark:text-white w-full cursor-pointer"
                    >
                      Delete
                    </Button>

                  </div>
                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="border p-5 mt-5 flex flex-col gap-3 items-center border-gray-200 dark:border-gray-700 rounded-2xl w-[280px] dark:bg-[#262829]">

            <FiUserX className="w-12 h-12" />

            <h1 className="text-xl font-semibold">
              No friend requests
            </h1>

            <p className="text-center text-gray-600 dark:text-gray-300">
              Looks like you're all caught up! Why not explore and
              connect with new people?
            </p>

          </div>
        )}

        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <hr className="my-12" />

        {/* ================================================= */}
        {/* PEOPLE YOU MAY KNOW */}
        {/* ================================================= */}

        <h1 className="text-2xl font-semibold">
          People you may know
        </h1>

        {peopleYouMayKnow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5">

            {peopleYouMayKnow.map((person) => (
              <div
                key={person._id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden dark:bg-[#262829] bg-white shadow-sm"
              >

                {/* Profile Image */}

                <img
                  src={person.profilePicture || userLogo}
                  onClick={() =>
                    navigate(`/profile/${person._id}/post`)
                  }
                  alt=""
                  className="w-full aspect-square object-cover cursor-pointer"
                />

                {/* Details */}

                <div className="p-4 space-y-3">

                  <h1 className="font-semibold text-lg">
                    {person.firstname} {person.lastname}
                  </h1>

                  <div className="flex flex-col gap-2">

                    <Button
                      onClick={() =>
                        sendFriendRequest(person._id)
                      }
                      className="dark:bg-[#243a52] dark:hover:bg-[#243a52] bg-[#ebf5ff] hover:bg-[#ebf5ff] text-blue-600 dark:text-blue-400 w-full cursor-pointer"
                    >
                      Add Friend
                    </Button>

                    <Button
                      onClick={() =>
                        setPeopleYouMayKnow((prev) =>
                          prev.filter(
                            (item) => item._id !== person._id
                          )
                        )
                      }
                      className="bg-[#e1e4e8] hover:bg-[#d8dade] text-gray-800 dark:bg-[#3b3d3e] dark:hover:bg-[#3b3d3e] dark:text-white w-full cursor-pointer"
                    >
                      Remove
                    </Button>

                  </div>
                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="border p-5 mt-5 flex flex-col gap-3 items-center border-gray-200 dark:border-gray-700 rounded-2xl w-[280px] dark:bg-[#262829]">

            <FiUserX className="w-12 h-12" />

            <h1 className="text-xl font-semibold">
              No people to show
            </h1>

            <p className="text-center text-gray-600 dark:text-gray-300">
              Looks like you're all caught up! Why not explore and
              connect with new people.
            </p>

          </div>
        )}

      </div>
    </div>
  );
};

export default Friends;