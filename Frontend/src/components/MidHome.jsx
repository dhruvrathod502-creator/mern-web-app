
import React, { useCallback, useEffect } from "react";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const MidHome = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const getAllPosts = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:9000/api/v1/post/getAllPost",
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setPosts(res.data.posts || []));
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  return (
    <div className="px-4">
      <div className="w-full max-w-[760px] px-2">
        <CreatePost />

        <div className="space-y-4 mt-4">
          {posts?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MidHome;