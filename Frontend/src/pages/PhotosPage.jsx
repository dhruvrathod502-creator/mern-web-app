import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const PhotosPage = () => {
  const { userProfile } = useSelector((store) => store.auth);
  const { id } = useParams();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPhotos = async () => {
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
          const imagePosts = (res.data.posts || []).filter(
            (post) => post.image,
          );

          setPhotos(imagePosts);
        }
      } catch (error) {
        console.log("PHOTO ERROR:", error.response?.data || error);

        toast.error(error.response?.data?.message || "Failed to load photos");
      } finally {
        setLoading(false);
      }
    };

    getPhotos();
  }, [id, userProfile?._id]);

  return (
    <div className="flex max-w-6xl mx-auto gap-5 mt-0 md:px-10 px-2">
      <div className="bg-white dark:bg-[#262829] p-5 rounded-lg mt-2 md:mt-5 w-full">
        <h1 className="font-semibold text-xl mb-5">Photos</h1>

        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading photos...</p>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-1 rounded-2xl">
            {photos.map((post) => (
              <img
                key={post._id}
                src={post.image}
                alt="Post"
                className="aspect-square rounded-lg object-cover"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">No photos available</p>
        )}
      </div>
    </div>
  );
};

export default PhotosPage;
