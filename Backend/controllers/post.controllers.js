import sharp from "sharp";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const userId = req.id;
    const { content } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const optimizedImageBuffer = await sharp(file.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64",
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      content,
      image: cloudResponse.secure_url,
      user: userId,
    });

    const user = await User.findById(userId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate("user", "-password");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "firstname lastname profilePicture" })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstname lastname profilePicture",
        },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;

    const posts = await Post.find({ user: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "firstname lastname image",
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPostByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const posts = await Post.find({ user: userId })
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== authorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.content = content || post.content;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const likedByUserId = req.id;

    const post = await Post.findById(postId).populate("likes");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await post.updateOne({
      $addToSet: { likes: likedByUserId },
    });

    return res.status(200).json({
      success: true,
      message: "Post liked",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const dislikedByUserId = req.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await post.updateOne({
      $pull: { likes: dislikedByUserId },
    });

    return res.status(200).json({
      success: true,
      message: "Post disliked",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

