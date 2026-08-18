import CreatePost from "@/components/CreatePost";
import Intro from "@/components/Intro";
import PostCard from "@/components/PostCard";
import React from "react";
import { useSelector } from "react-redux";

const PostPage = () => {
  const { userProfile } = useSelector((store) => store.auth);

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-2 md:gap-5 mt-2 md:mt-5 px-2 md:px-10">
      <div>
        {/* Intro */}
        <Intro />
      </div>

      <div className="space-y-4">
        <CreatePost />

        <div className="space-y-4">
          {userProfile?.posts?.map((post, index) => {
            return <PostCard key={post._id || index} post={post} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
