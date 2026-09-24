import CreatePost from "@/components/CreatePost";
import Intro from "@/components/Intro";
import PostCard from "@/components/PostCard";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const PostPage = () => {
  const { userProfile } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        setLoading(true);

        const userId = id || userProfile?._id;

        if (!userId) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:9000/api/v1/post/${userId}`,
          {
            withCredentials: true,
          },
        );

        if (res.data.success) {
          dispatch(setPosts(res.data.posts || []));
        }
      } catch (error) {
        console.log("GET USER POSTS ERROR:", error);

        toast.error(error.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    getUserPosts();
  }, [id, userProfile?._id, dispatch]);

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-2 md:gap-5 mt-2 md:mt-5 px-2 md:px-10">
      <div>
        <Intro />
      </div>

      <div className="space-y-4 w-full">
        <CreatePost />

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 py-5">Loading posts...</p>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="bg-white dark:bg-[#262829] rounded-2xl p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No posts available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
