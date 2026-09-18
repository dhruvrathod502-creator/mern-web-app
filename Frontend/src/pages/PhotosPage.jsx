import React from "react";
import { useSelector } from "react-redux";

const PhotosPage = () => {
  const { userProfile } = useSelector((store) => store.auth);

  const photos = userProfile?.posts?.filter((post) => post.image) || [];

  return (
    <div className="flex max-w-6xl mx-auto gap-5 mt-0 md:px-10 px-2">
      <div className="bg-white dark:bg-[#262829] p-5 rounded-lg mt-2 md:mt-5 w-full">
        <h1 className="font-semibold text-xl mb-5">Photos</h1>

        {photos.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-1 rounded-2xl">
            {photos.map((post) => {
              return (
                <img
                  key={post._id}
                  src={post.image}
                  alt=""
                  className="aspect-square rounded-lg object-cover"
                />
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">No photos available</p>
        )}
      </div>
    </div>
  );
};

export default PhotosPage;
