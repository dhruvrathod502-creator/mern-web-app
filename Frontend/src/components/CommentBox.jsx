import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import userLogo from "../assets/user.jpg";
import { Textarea } from "./ui/textarea";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { BsThreeDots } from "react-icons/bs";
import { formatFBTime } from "../lib/utils";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import axios from "axios";


const CommentBox = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [content, setContent] = useState("");

// Add Comment
const postCommentHandler = async (id) => {
  if (!content.trim()) return;

  try {
    const res = await axios.post(
      `http://localhost:9000/api/v1/comment/${id}/create`,
      {
        content: content.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      setContent("");
      toast.success(res.data.message);
    }
  } catch (error) {
    console.log("Create comment error:", error);

    toast.error(
      error.response?.data?.message || "Failed to add comment"
    );
  }
};


// Delete Comment
const deleteCommentHandler = async (id) => {
  try {
    const res = await axios.delete(
      `http://localhost:9000/api/v1/comment/${id}/delete`,
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
    }
  } catch (error) {
    console.log("Delete comment error:", error);

    toast.error(
      error.response?.data?.message || "Failed to delete comment"
    );
  }
};


// Like Comment
const likeCommentHandler = async (commentId) => {
  try {
    const res = await axios.post(
      `http://localhost:9000/api/v1/comment/${commentId}/like`,
      {},
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
    }
  } catch (error) {
    console.error("Error liking comment:", error);

    toast.error(
      error.response?.data?.message || "Something went wrong"
    );
  }
};

  const handleCommentSubmit = () => {
    if (!content.trim()) return;

    postCommentHandler(post?._id);
  };

  return (
    <div className="mt-4">
      <hr />

      {/* Comment Input */}
      <div className="flex gap-2 mt-4 items-center">
        <Avatar>
          <AvatarImage src={user?.profilePicture || userLogo} />

          <AvatarFallback>{user?.firstname?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>

        <Textarea
          className="p-3 bg-[#e4e6eb]"
          placeholder={`Comment as ${user?.firstname || ""} ${
            user?.lastname || ""
          }`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <PiPaperPlaneRightFill
          onClick={handleCommentSubmit}
          className="h-8 w-8 cursor-pointer"
        />
      </div>

      {/* Comments */}
      <div className="mt-4 space-y-4">
        {post?.comments?.map((comment) => (
          <div key={comment?._id} className="flex items-start justify-between">
            {/* Comment */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={comment?.userId?.profilePicture || userLogo}
                />

                <AvatarFallback>
                  {comment?.userId?.firstname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                {/* Comment Content */}
                <div className="p-3 rounded-2xl dark:bg-[#303233] bg-[#e4e6eb]">
                  <h1>
                    {comment?.userId?.firstname} {comment?.userId?.lastname}
                  </h1>

                  <p>{comment?.content}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-6 px-2 mt-1 items-center">
                  <p className="text-sm text-gray-500">
                    {formatFBTime(comment?.createdAt)}
                  </p>

                  <p onClick={() => likeCommentHandler(comment._id)}
                    className={`${
                      comment?.likes?.includes(user?._id)
                        ? "text-blue-600 font-semibold"
                        : ""
                    } cursor-pointer`}
                  >
                    Like
                  </p>

                  <p className="cursor-pointer">Reply</p>
                </div>
              </div>
            </div>

            {/* Three dots */}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#303233] cursor-pointer">
                <BsThreeDots />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => deleteCommentHandler(comment._id)}>Delete</DropdownMenuItem>

                <DropdownMenuItem>Edit</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentBox;
