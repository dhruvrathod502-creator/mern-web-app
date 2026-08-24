import Photos from "@/components/Photos";
import React from "react";
import { useSelector } from "react-redux";

const PhotosPage = () => {
  const { userProfile } = useSelector((store) => store.auth);
  return (
    <div className="flex max-w-6xl mx-auto gap-5 mt-0 md:px-10 px-2">
      <div className="bg-white dark:bg-[#262829] p-5 rounded-lg mt-2 md:mt-5">
        <h1 className="font-semibold text-xl mb-5">Photos</h1>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-1 rounded-2xl">
          {userProfile.posts.map((post) => {
            return (
              <img
                key={post._id}
                src={post.image}
                alt=""
                className="aspect-square rounded-lg"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhotosPage;
