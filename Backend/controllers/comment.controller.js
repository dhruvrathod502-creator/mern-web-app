import { Comment } from "../models/comment.model.js";
import Post from "../models/post.model.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentingUserId = req.id;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!content)return res.status(400).json({ success: false, message: "Comment content is required" });

      const comment = await Comment.create({
        content,
        userId: commentingUserId,
        postId
      })

      await comment.populate({
        path: "userId",
        select: 'firstName lastName profilePicture'
      })

      post.comments.push(comment._id);
      await post.save();

      res.status(201).json({ success: true, message: "Comment added successfully", comment });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const authorId = req.id;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.userId.toString() !== authorId) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
    }

    const postId = comment.postId;
    //Delete the comment
    await Comment.findByIdAndDelete(commentId);
    
    //Remove the comment from the post's comments array
    await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message:"Error deleting comment", error: error.message });
  }
}

export const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Make sure likes exists
    if (!comment.likes) {
      comment.likes = [];
    }

    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Unlike
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      comment.numberOfLikes = Math.max(
        0,
        (comment.numberOfLikes || 0) - 1
      );
    } else {
      // Like
      comment.likes.push(userId);

      comment.numberOfLikes =
        (comment.numberOfLikes || 0) + 1;
    }

    await comment.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Comment unliked"
        : "Comment liked",
      updatedComment: comment,
    });
  } catch (error) {
    console.error("LIKE COMMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while liking the comment",
      error: error.message,
    });
  }
};