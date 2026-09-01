import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import userLogo from "../assets/user.jpg";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { Image, Smile, ThumbsUp, Video, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { PiShareFat } from "react-icons/pi";
import { VscCommentCompact } from "react-icons/vsc";
import CommentBox from "./CommentBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { readFileAsDataURL } from "@/lib/utils";
import { data } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaEarthAmericas } from "react-icons/fa6";
import { Textarea } from "./ui/textarea";

const PostCard = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState(null);
  const [file, setFile] = useState(post?.image);
  const imageRef = useRef();
  const dispatch = useDispatch();

  function formatFBTime(isoTime) {
    const date = new Date(isoTime);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
    const optionsDate = { month: "long", day: "numeric" };
    const optionsDateYear = { ...optionsDate, year: "numeric" };

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} mins ago`;
    if (diffHr < 24) return `${diffHr} hrs ago`;

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `Yesterday at ${date.toLocaleTimeString("en-US", optionsTime)}`;
    }

    if (date.getFullYear() === now.getFullYear()) {
      return `${date.toLocaleDateString("en-US", optionsDate)} at ${date.toLocaleTimeString("en-US", optionsTime)}`;
    }

    return `${date.toLocaleDateString("en-US", optionsDateYear)} at ${date.toLocaleTimeString("en-US", optionsTime)}`;
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:9000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // Update the posts
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p,
        );
        toast.success(res.data.message);
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:9000/api/v1/post/${post._id}`,
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post._id);

        dispatch(setPosts(updatedPosts));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error deleting post");
    }
  };

  const handleShare = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post",
          text: "Check out this post",
          url: postUrl,
        })
        .then(() => console.log("Post shared successfully"))
        .catch((error) => console.error("Error sharing post:", error));
    } else {
      //fallback :copy to clip board
      navigator.clipboard.writeText(postUrl).then(() => {
        toast.success("Post URL copied to clipboard");
      });
    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);

    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const onSubmitHandler = async (id) => {
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
      const res = await axios.put(
        `http://localhost:9000/api/v1/post/update-post/${post._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        const updatedPosts = posts.map((p) =>
          p._id === post._id ? res.data.post : p,
        );

        dispatch(setPosts(updatedPosts));

        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Error updating post");
    }
  };

  const editPostHandler = async (post) => {
    setOpen(true);
    setImagePreview(post.image);
    setContent(post.content);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-700 dark:bg-[#262829]">
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={post?.user?.profilePicture || userLogo} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold">
              {post?.user?.firstname} {post?.user?.lastname}
            </h1>
            <p className="text-sm">{formatFBTime(post?.createdAt)}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#303233] cursor-pointer">
            <BsThreeDots className="cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => deleteHandler(post._id)}>
              Delete Post
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => editPostHandler(post)}>
              Edit Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={open} onOpenChange={setOpen}>
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
                onChange={fileChangeHandler}
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
                onClick={onSubmitHandler}
                type="button"
                className="w-full bg-[#0866ff] hover:bg-[#0866ffdd]"
              >
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {post?.content && (
        <div className="px-4 pt-3 pb-4">
          <p className="text-[15px] leading-6 text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>
      )}
      <img
        src={post?.image}
        alt=""
        className="w-full object-cover max-h-[750px]"
      />
      <div className="my-2">
        <div className="flex justify-between">
          <p>{postLike} Likes</p>
          <div className="flex items-center gap-7">
            <p>{post?.comments?.length} Comment</p>
            <p>10 Share</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-between items-center mt-2 md:px-7">
        <div onClick={likeOrDislikeHandler}>
          {liked ? (
            <div className="flex gap-2 items-center cursor-pointer">
              <ThumbsUp fill="#0866ff" className="text-gray-700" />
              <p className="font-semibold text-blue-600">Like</p>
            </div>
          ) : (
            <div className="flex gap-2 items-center cursor-pointer">
              <ThumbsUp />
              <p>Like</p>
            </div>
          )}
        </div>
        <div
          onClick={() => setOpenCommentDialog(!openCommentDialog)}
          className="flex gap-2 items-center cursor-pointer"
        >
          <VscCommentCompact />
          <p>Comment</p>
        </div>
        <div
          onClick={() => handleShare(post?._id)}
          className="flex gap-2 items-center cursor-pointer"
        >
          <PiShareFat className="h-6 w-6" />
          <p>Share</p>
        </div>
      </div>
      {openCommentDialog && (
        <CommentBox post={post} formatTime={formatFBTime} />
      )}
    </div>
  );
};

export default PostCard;
