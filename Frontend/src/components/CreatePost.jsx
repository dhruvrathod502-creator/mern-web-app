import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import userLogo from "../assets/user.jpg";
import { Input } from "./ui/input";
import { Image, Smile, Video, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FaEarthAmericas } from "react-icons/fa6";
import { TiArrowSortedDown } from "react-icons/ti";
import { Textarea } from "./ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { setPosts } from "@/redux/postSlice";

const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const {posts} = useSelector(store=>store.post)
  const dispatch = useDispatch();

  const filechangeHandler = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setFile(file);

      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  // Cancel image preview
  const removeImage = () => {
    setFile("");
    setImagePreview("");

    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const submitHandler = async () => {
    if (!content && !file) {
      toast.error("Post must have content or an image");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await axios.post(
        "http://localhost:9000/api/v1/post/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success("Post created successfully");
        dispatch(setPosts([...posts, res.data.post]))
        setOpen(false);
        setContent("");
        setFile("");
        setImagePreview("");

        if (imageRef.current) {
          imageRef.current.value = "";
        }
      } else {
        toast.error(res.data.message || "Failed to post");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to post");
    }
  };

  return (
    <div className="bg-white dark:bg-[#262829] p-4 rounded-xl shadow-md w-full mt-4">
      {/* Top Section */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profilePicture || userLogo} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Dialog open={open} onOpenChange={setOpen}>
          <Input
            onClick={() => setOpen(true)}
            placeholder={`What's on your mind, ${user?.firstname}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            readOnly
            className="
              flex-1
              h-11
              bg-[#f0f2f5]
              hover:bg-[#e4e6e9]
              rounded-full
              px-4
              border-none
              shadow-none
              text-base
              cursor-pointer
              focus-visible:ring-0
              focus-visible:border-none
            "
          />

          <DialogContent className="sm:max-w-[500px] dark:bg-[#262829]">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-semibold">
                Create Post
              </DialogTitle>

              <hr className="my-2" />

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.profilePicture || userLogo} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="font-semibold">
                    {user?.firstname} {user?.lastname}
                  </h1>

                  <div className="bg-gray-200 rounded-lg px-2 py-1 flex items-center gap-1 w-fit">
                    <FaEarthAmericas className="text-gray-700 w-4 h-4" />
                    <span className="text-sm text-black">Public</span>
                    <TiArrowSortedDown />
                  </div>
                </div>
              </div>
            </DialogHeader>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${user?.firstname}?`}
              className="text-xl border-none shadow-none"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mt-2 border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-[300px] object-contain rounded-lg"
                />

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={removeImage}
                  className="
                    absolute
                    top-2
                    right-2
                    bg-black/70
                    text-white
                    rounded-full
                    w-8
                    h-8
                    flex
                    items-center
                    justify-center
                    hover:bg-black
                  "
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="border rounded-lg p-4 flex justify-between items-center">
              <h1 className="font-semibold">Add to your post</h1>

              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={filechangeHandler}
              />

              <div className="flex gap-3 items-center">
                <Image
                  onClick={() => imageRef.current?.click()}
                  className="text-green-600 cursor-pointer"
                />

                <Video
                  onClick={() => imageRef.current?.click()}
                  className="text-red-500 cursor-pointer"
                />

                <Smile
                  onClick={() => imageRef.current?.click()}
                  className="text-orange-500 cursor-pointer"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={submitHandler}
                type="button"
                className="w-full bg-[#0866ff] hover:bg-[#0866ffdd]"
              >
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <hr className="my-4" />

      {/* Bottom Buttons */}
      <div className="flex justify-around items-center">
        <div
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-[#3a3b3c] px-4 py-2 rounded-lg"
        >
          <Image className="text-green-600" />
          Photo
        </div>

        <div
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-[#3a3b3c] px-4 py-2 rounded-lg"
        >
          <Video className="text-red-600" />
          Video
        </div>

        <div
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-[#3a3b3c] px-4 py-2 rounded-lg"
        >
          <Smile className="text-orange-600" />
          Feeling
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
