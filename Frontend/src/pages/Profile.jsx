import React, { useEffect, useRef, useState } from "react";
import emptyCover from "../assets/emptyCover.jpg";
import { Button } from "@/components/ui/button";
import { FaCamera, FaFacebookMessenger, FaUserPlus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { FiUserX } from "react-icons/fi";
import { toast } from "sonner";
import userLogo from "../assets/user.jpg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, Images, SquareUser } from "lucide-react";
import { MdDashboard } from "react-icons/md";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser, setUserProfile } from "@/redux/authSlice";

import { Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import unfollow from "../assets/unfollow.png";

const Profile = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { loading, user, userProfile } = useSelector((store) => store.auth);

  const coverPhoto = userProfile?.coverPhoto || emptyCover;

  const profileRef = useRef();
  const coverRef = useRef();

  // =========================
  // FETCH PROFILE
  // =========================

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9000/api/v1/auth/profile/${params.id}`,
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // PROFILE PICTURE
  // =========================

  const handelProfilePicChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      dispatch(setLoading(true));

      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/update/profile-pic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const profilePicture = res.data.profilePicture;

        dispatch(
          setUser({
            ...user,
            profilePicture,
          }),
        );

        dispatch(
          setUserProfile({
            ...userProfile,
            profilePicture,
          }),
        );
      }
    } catch (error) {
      console.error("Error uploading profile picture", error);

      toast.error(
        error.response?.data?.message || "Failed to update profile picture",
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // =========================
  // COVER PICTURE
  // =========================

  const handelCoverPicChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      dispatch(setLoading(true));

      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/update/cover-pic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const coverPhoto = res.data.coverPhoto;

        dispatch(
          setUser({
            ...user,
            coverPhoto,
          }),
        );

        dispatch(
          setUserProfile({
            ...userProfile,
            coverPhoto,
          }),
        );
      }
    } catch (error) {
      console.error("Error uploading cover picture", error);

      toast.error(
        error.response?.data?.message || "Failed to update cover picture",
      );
    } finally {
      dispatch(setLoading(false));
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
        },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setUserProfile(res.data.userProfile));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
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
        },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setUserProfile(res.data.userProfile));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // CANCEL FRIEND REQUEST
  // =========================

  const getCancelFriendRequest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/request/cancel/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setUserProfile(res.data.userProfile));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
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
        },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setUserProfile(res.data.userProfile));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // UNFRIEND
  // =========================

  const unFriendUser = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/unfriend/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setUserProfile(res.data.userProfile));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // FOLLOW
  // =========================

  const followUser = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/follow/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setUserProfile(res.data.userProfile));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // UNFOLLOW
  // =========================

  const unFollowUser = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/unfollow/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setUserProfile(res.data.userProfile));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // FETCH PROFILE ON ID CHANGE
  // =========================

  useEffect(() => {
    if (params.id) {
      fetchUserProfile();
      window.scrollTo(0, 0);
    }
  }, [params.id]);

  // =========================
  // RETURN
  // =========================

  return (
    <div className="min-h-screen">
      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="fixed inset-0 z-[99999] bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="text-white text-xl font-semibold animate-pulse">
            Uploading....
          </div>
        </div>
      )}

      {/* =========================
          COVER SECTION
      ========================= */}

      <div className="relative w-full">
        {/* Blurred Background */}

        <div
          className="absolute inset-0 bg-center bg-cover filter"
          style={{
            backgroundImage: `url(${coverPhoto})`,
          }}
        ></div>

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/40 backdrop-blur-lg bg-gradient-to-b from-transparent dark:to-[#262829] to-white"></div>

        {/* Actual Cover */}

        <div className="relative flex justify-center items-center">
          <img
            src={coverPhoto}
            alt="cover"
            className="rounded-lg w-full max-w-6xl h-64 md:h-80 object-cover"
          />

          <input
            type="file"
            className="hidden"
            ref={coverRef}
            onChange={handelCoverPicChange}
          />

          {/* Only profile owner can edit */}

          {user?._id === userProfile?._id && (
            <Button
              onClick={() => coverRef?.current?.click()}
              className="absolute right-3 md:right-52 cursor-pointer bottom-3 flex gap-2 items-center bg-white text-gray-800 hover:bg-gray-100"
            >
              <FaCamera />

              <span>Edit cover photo</span>
            </Button>
          )}
        </div>
      </div>

      {/* =========================
          PROFILE INFO SECTION
      ========================= */}

      <div className="dark:bg-[#262829] bg-white z-40 py-4">
        <div className="max-w-6xl mx-auto md:px-10 px-5 flex flex-col md:flex-row md:items-center md:justify-between">
          {/* LEFT SIDE */}

          <div className="flex flex-col md:flex-row md:gap-5 md:items-center relative">
            {/* Hidden profile input */}

            <input
              type="file"
              className="hidden"
              ref={profileRef}
              onChange={handelProfilePicChange}
            />

            {/* PROFILE IMAGE */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={userProfile?.profilePicture || userLogo}
                  alt="profile"
                  className="w-44 h-44 cursor-pointer hover:invert-25 rounded-full border-4 border-white dark:border-[#262829] object-cover z-30 -mt-16"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-xs">
                {/* See profile picture */}

                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="flex gap-2 items-center"
                >
                  <SquareUser />
                  See profile picture
                </DropdownMenuItem>

                {/* Choose profile picture */}

                {user?._id === userProfile?._id && (
                  <DropdownMenuItem
                    onClick={() => profileRef?.current?.click()}
                    className="flex gap-2 items-center"
                  >
                    <Images />
                    Choose profile picture
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* PROFILE DIALOG */}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Profile Picture
                  </DialogTitle>

                  <hr className="mt-3" />
                </DialogHeader>

                <img
                  src={userProfile?.profilePicture || userLogo}
                  alt="Profile Picture"
                  className="rounded-lg object-cover"
                />
              </DialogContent>
            </Dialog>

            {/* CAMERA ICON */}

            {user?._id === userProfile?._id && (
              <span
                onClick={() => profileRef?.current?.click()}
                className="bg-gray-200 absolute z-40 left-32 cursor-pointer bottom-20 md:bottom-5 dark:bg-[#3a3c3d] p-2 rounded-full"
              >
                <FaCamera className="h-5 w-5" />
              </span>
            )}

            {/* NAME */}

            <div>
              <h1 className="text-3xl font-bold">
                {userProfile?.firstname} {userProfile?.lastname}
              </h1>

              <p className="text-gray-600 dark:text-gray-200">
                {userProfile?.followers?.length || 0} followers •{" "}
                {userProfile?.following?.length || 0} following
              </p>
            </div>
          </div>

          {/* =========================
              RIGHT SIDE BUTTONS
          ========================= */}

          <div className="flex gap-2 items-center mt-4 md:mt-0 flex-wrap">
            {/* OWNER */}

            {user?._id === userProfile?._id && (
              <>
                <Button className="bg-[#0866ff] hover:bg-[#0867ffbe] cursor-pointer text-white">
                  <MdDashboard />
                  Professional Dashboard
                </Button>

                <Button className="flex gap-2 items-center bg-[#e1e4e8] hover:bg-[#e1e7ef] cursor-pointer dark:bg-[#3a3c3d] text-gray-800 dark:text-gray-200">
                  <Edit />
                  Edit
                </Button>
              </>
            )}

            {/* =========================
                ALREADY FRIEND
            ========================= */}

            {user?._id !== userProfile?._id &&
              user?.friends?.includes(userProfile?._id) && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-[#e1e4e8] hover:bg-[#c0c3c6] dark:bg-[#3a3c3d] dark:text-white text-gray-800 cursor-pointer">
                        <FaUserCheck />
                        Friends
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[200px]">
                      {/* Follow / Unfollow */}

                      {user?.following?.includes(userProfile?._id) ? (
                        <DropdownMenuItem
                          onClick={() => unFollowUser(userProfile?._id)}
                          className="flex gap-2 items-center"
                        >
                          <img src={unfollow} alt="" className="h-4 w-4" />
                          Unfollow
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => followUser(userProfile?._id)}
                          className="flex gap-2 items-center"
                        >
                          <img src={unfollow} alt="" className="h-4 w-4" />
                          Follow
                        </DropdownMenuItem>
                      )}

                      {/* Unfriend */}

                      <DropdownMenuItem
                        onClick={() => unFriendUser(userProfile?._id)}
                        className="flex gap-2 items-center"
                      >
                        <FiUserX />
                        Unfriend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button className="bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer">
                    <FaFacebookMessenger />
                    Message
                  </Button>
                </>
              )}

            {/* =========================
                INCOMING REQUEST
            ========================= */}

            {user?._id !== userProfile?._id &&
              userProfile?.sentRequests?.includes(user?._id) && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-[#0866ff] text-white hover:bg-[#0867ffd2] cursor-pointer">
                        <FaUserCheck />
                        Respond
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[200px]">
                      <DropdownMenuItem
                        onClick={() => acceptFriendRequest(userProfile?._id)}
                      >
                        Confirm
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => rejectFriendRequest(userProfile?._id)}
                      >
                        Delete Request
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button className="bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer">
                    <FaFacebookMessenger />
                    Message
                  </Button>
                </>
              )}

            {/* =========================
                OUTGOING REQUEST
            ========================= */}

            {user?._id !== userProfile?._id &&
              user?.sentRequests?.includes(userProfile?._id) && (
                <>
                  <Button
                    onClick={() => getCancelFriendRequest(userProfile?._id)}
                    className="bg-[#0866ff] text-white hover:bg-[#0867ffd2] cursor-pointer"
                  >
                    <FaUserCheck />
                    Cancel request
                  </Button>

                  <Button className="bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer">
                    <FaFacebookMessenger />
                    Message
                  </Button>
                </>
              )}

            {/* =========================
                NO RELATIONSHIP
            ========================= */}

            {user?._id !== userProfile?._id &&
              !user?.friends?.includes(userProfile?._id) &&
              !user?.sentRequests?.includes(userProfile?._id) &&
              !user?.friendRequests?.includes(userProfile?._id) && (
                <>
                  <Button
                    onClick={() => sendFriendRequest(userProfile?._id)}
                    className="bg-[#e1e4e8] hover:bg-[#e1e7ef] cursor-pointer dark:bg-[#3a3c3d] text-gray-800 dark:text-gray-200"
                  >
                    <FaUserPlus />
                    Add friend
                  </Button>

                  <Button className="bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer">
                    <FaFacebookMessenger />
                    Message
                  </Button>
                </>
              )}
          </div>
        </div>

        {/* =========================
            PROFILE NAVIGATION
        ========================= */}

        <hr className="mt-5 mb-2 max-w-6xl mx-auto" />

        <div className="flex md:gap-10 max-w-6xl mx-auto md:px-10">
          <span
            onClick={() => navigate(`/profile/${userProfile?._id}/post`)}
            className="hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer"
          >
            Post
          </span>

          <span
            onClick={() => navigate(`/profile/${userProfile?._id}/about`)}
            className="hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer"
          >
            About
          </span>

          <span
            onClick={() => navigate(`/profile/${userProfile?._id}/friends`)}
            className="hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer"
          >
            Friends
          </span>

          <span
            onClick={() => navigate(`/profile/${userProfile?._id}/photos`)}
            className="hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer"
          >
            Photos
          </span>
        </div>
      </div>

      {/* =========================
          CHILD ROUTES
      ========================= */}

      <Outlet />
    </div>
  );
};

export default Profile;
