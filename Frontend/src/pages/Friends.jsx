import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FiUserX, FiUsers, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import userLogo from "../assets/emptyUser.webp";

const API = "http://localhost:9000/api/v1/auth";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadUserDetails = useCallback(async (person) => {
    if (!person?._id) return person;

    try {
      const res = await axios.get(`${API}/profile/${person._id}`, {
        withCredentials: true,
      });

      return {
        ...person,
        profilePicture:
          res.data?.profile?.profilePicture || person.profilePicture || null,
      };
    } catch (error) {
      console.error("Could not load profile:", error);
      return person;
    }
  }, []);

  const getFriendRequest = useCallback(async () => {
    setLoading(true);

    try {
      let currentUserId = user?._id;

      if (!currentUserId) {
        const me = await axios.get(`${API}/me`, {
          withCredentials: true,
        });

        currentUserId = me.data?.user?._id;

        if (me.data?.user) {
          dispatch(setUser(me.data.user));
        }
      }

      const res = await axios.get(`${API}/request/list`, {
        withCredentials: true,
      });

      if (!res.data.success) return;

      const relations = res.data.friends || [];
      const incoming = res.data.requests || [];

      // Get the OTHER user from each accepted friendship.
      const friendUsers = relations
        .map((relation) => {
          const sender = relation.sender;
          const receiver = relation.receiver;

          if (!sender || !receiver) return null;

          const senderId = typeof sender === "object" ? sender._id : sender;

          const receiverId =
            typeof receiver === "object" ? receiver._id : receiver;

          if (String(senderId) === String(currentUserId)) {
            return typeof receiver === "object" ? receiver : null;
          }

          if (String(receiverId) === String(currentUserId)) {
            return typeof sender === "object" ? sender : null;
          }

          return null;
        })
        .filter(Boolean);

      // Prevent duplicate friends.
      const uniqueFriends = [
        ...new Map(
          friendUsers.map((person) => [String(person._id), person]),
        ).values(),
      ];

      const [friendsWithProfiles, requestsWithProfiles] = await Promise.all([
        Promise.all(uniqueFriends.map(loadUserDetails)),
        Promise.all(
          incoming.map(async (request) => ({
            ...request,
            sender: await loadUserDetails(request.sender),
          })),
        ),
      ]);

      setFriends(friendsWithProfiles);
      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error("Get friends error:", error);
      toast.error(error.response?.data?.message || "Failed to load friends");
    } finally {
      setLoading(false);
    }
  }, [user?._id, dispatch, loadUserDetails]);

  const openProfile = (userId) => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }

    // Use the actual User document ID, not the friendship ID.
    navigate(`/profile/${userId}/post`);
  };

  const acceptFriendRequest = async (senderId) => {
    try {
      const res = await axios.put(
        `${API}/request/accept/${senderId}`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await getFriendRequest();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not accept request");
    }
  };

  const rejectFriendRequest = async (senderId) => {
    try {
      const res = await axios.put(
        `${API}/request/reject/${senderId}`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await getFriendRequest();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not reject request");
    }
  };

  const unfriend = async (friendId) => {
    try {
      const res = await axios.put(
        `${API}/request/unfriend/${friendId}`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await getFriendRequest();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove friend");
    }
  };

  useEffect(() => {
    getFriendRequest();
  }, [getFriendRequest]);

  const personName = (person) =>
    [person?.firstname, person?.lastname].filter(Boolean).join(" ") || "User";

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a]">
      <Navbar />

      <main className="mx-auto w-full max-w-[1150px] px-4 pb-20 pt-24 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Friends
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your friends, friend requests and discover new people.
          </p>
        </div>

        <section className="rounded-2xl bg-white p-5 shadow-sm dark:bg-[#242526] md:p-6">
          <div className="mb-5 flex items-center gap-2">
            <FiUsers className="h-6 w-6 text-[#0866ff]" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Friends
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {friends.length} {friends.length === 1 ? "friend" : "friends"}
              </p>
            </div>
          </div>

          {loading ? (
            <p>Loading friends...</p>
          ) : friends.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#242526]"
                >
                  <img
                    src={friend.profilePicture || userLogo}
                    onClick={() => openProfile(friend._id)}
                    alt={personName(friend)}
                    className="aspect-square w-full cursor-pointer object-cover transition duration-300 group-hover:scale-[1.02]"
                  />

                  <div className="p-3 md:p-4">
                    <h3 className="truncate font-bold text-gray-900 dark:text-white">
                      {personName(friend)}
                    </h3>

                    <p className="mb-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Friend
                    </p>

                    <Button
                      onClick={() => openProfile(friend._id)}
                      className="h-10 w-full bg-[#e7f3ff] font-semibold text-[#0866ff] hover:bg-[#dbeeff]"
                    >
                      View Profile
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => unfriend(friend._id)}
                      className="mt-2 w-full"
                    >
                      Unfriend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
              <FiUserX className="mb-3 h-8 w-8 text-gray-500" />
              <h3 className="font-bold">No friends yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add people or accept friend requests to see your friends here.
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm dark:bg-[#242526] md:p-6">
          <div className="mb-5 flex items-center gap-2">
            <FiUserPlus className="h-6 w-6 text-[#0866ff]" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Friend Requests
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {requests.length} pending
              </p>
            </div>
          </div>

          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {requests.map((request) => {
                const sender = request.sender;

                if (!sender?._id) return null;

                return (
                  <div
                    key={request._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={sender.profilePicture || userLogo}
                      onClick={() => openProfile(sender._id)}
                      alt={personName(sender)}
                      className="aspect-square w-full cursor-pointer object-cover"
                    />

                    <div className="p-3">
                      <h3 className="truncate font-bold">
                        {personName(sender)}
                      </h3>
                      <p className="mb-3 mt-1 text-sm text-gray-500">
                        Wants to be your friend
                      </p>

                      <Button
                        onClick={() => acceptFriendRequest(sender._id)}
                        className="w-full bg-[#0866ff] text-white"
                      >
                        Confirm
                      </Button>

                      <Button
                        onClick={() => rejectFriendRequest(sender._id)}
                        variant="outline"
                        className="mt-2 w-full"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
              <FiUserX className="mb-3 h-8 w-8 text-gray-500" />
              <h3 className="font-bold">No friend requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                New friend requests will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Friends;
