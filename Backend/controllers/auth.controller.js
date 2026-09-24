
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Bio } from "../models/userbio.model.js";
import Friendship from "../models/friendship.model.js";

// ==================== REGISTER ====================

export const registerUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      gender,
      dateOfBirth,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== LOGIN ====================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const matchPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome back ${user.firstname} ${user.lastname}`,
        user,
      });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== LOGOUT ====================

export const logoutUser = async (_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
      })
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==================== GET PROFILE ====================

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const bio = await Bio.findOne({
      user: userId,
    });

    const sentRequests = await Friendship.find({
      sender: userId,
      status: "pending",
    }).populate(
      "receiver",
      "firstname lastname email profilePicture"
    );

    const receivedRequests = await Friendship.find({
      receiver: userId,
      status: "pending",
    }).populate(
      "sender",
      "firstname lastname email profilePicture"
    );

    const friendships = await Friendship.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
      status: "accepted",
    })
      .populate(
        "sender",
        "firstname lastname email profilePicture"
      )
      .populate(
        "receiver",
        "firstname lastname email profilePicture"
      );

    return res.status(200).json({
      success: true,
      user,
      bio,
      friendships,
      sentRequests,
      receivedRequests,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ==================== UPDATE PROFILE PHOTO ====================

export const updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Profile picture is required",
        success: false,
      });
    }

    const fileUri = getDataUri(file);

    const result = await cloudinary.uploader.upload(fileUri);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        profilePicture: result.secure_url,
      },
      {
        returnDocument: "after",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

// ==================== UPDATE COVER PHOTO ====================

export const updateCoverPhoto = async (req, res) => {
  try {
    const userId = req.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Cover picture is required",
        success: false,
      });
    }

    const fileUri = getDataUri(file);

    const result = await cloudinary.uploader.upload(fileUri);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        coverPhoto: result.secure_url,
      },
      {
        returnDocument: "after",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Cover photo updated successfully",
      coverPhoto: user.coverPhoto,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

// ==================== UPDATE BIO ====================

export const updateIntro = async (req, res) => {
  try {
    const userId = req.id;

    const {
      bioText,
      liveIn,
      relationship,
      workplace,
      education,
      phone,
      hometown,
    } = req.body;

    let bio = await Bio.findOne({
      user: userId,
    });

    if (!bio) {
      bio = new Bio({
        user: userId,
      });
    }

    if (bioText !== undefined) {
      bio.bioText = bioText;
    }

    if (liveIn !== undefined) {
      bio.liveIn = liveIn;
    }

    if (relationship !== undefined) {
      bio.relationship = relationship;
    }

    if (workplace !== undefined) {
      bio.workplace = workplace;
    }

    if (education !== undefined) {
      bio.education = education;
    }

    if (phone !== undefined) {
      bio.phone = phone;
    }

    if (hometown !== undefined) {
      bio.hometown = hometown;
    }

    await bio.save();

    return res.status(200).json({
      success: true,
      message: "Bio updated successfully",
      bio,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Error updating bio",
      error: error.message,
    });
  }
};

// ==================== GET CURRENT USER ====================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== SEND FRIEND REQUEST ====================

export const sendFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.id;
    const targetUserId = req.params.id;

    if (
      currentUserId.toString() ===
      targetUserId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You can't send friend request to yourself",
      });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingFriendship = await Friendship.findOne({
      $or: [
        {
          sender: currentUserId,
          receiver: targetUserId,
        },
        {
          sender: targetUserId,
          receiver: currentUserId,
        },
      ],
    });

    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        return res.status(400).json({
          success: false,
          message: "You are already friends",
        });
      }

      if (
        existingFriendship.status === "pending" &&
        existingFriendship.sender.toString() ===
          currentUserId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Friend request already sent",
        });
      }

      if (
        existingFriendship.status === "pending" &&
        existingFriendship.receiver.toString() ===
          currentUserId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This user has already sent you a friend request",
        });
      }

      if (existingFriendship.status === "rejected") {
        await Friendship.findByIdAndDelete(
          existingFriendship._id
        );
      }
    }

    const friendship = await Friendship.create({
      sender: currentUserId,
      receiver: targetUserId,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
      friendship,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== GET FRIEND REQUESTS ====================

export const getFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.id;

    const requests = await Friendship.find({
      receiver: currentUserId,
      status: "pending",
    })
      .populate(
        "sender",
        "firstname lastname email profilePicture"
      )
      .sort({
        createdAt: -1,
      });

    const sentRequests = await Friendship.find({
      sender: currentUserId,
      status: "pending",
    })
      .populate(
        "receiver",
        "firstname lastname email profilePicture"
      )
      .sort({
        createdAt: -1,
      });

    const friends = await Friendship.find({
      $or: [
        {
          sender: currentUserId,
        },
        {
          receiver: currentUserId,
        },
      ],
      status: "accepted",
    })
      .populate(
        "sender",
        "firstname lastname email profilePicture"
      )
      .populate(
        "receiver",
        "firstname lastname email profilePicture"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      requests,
      sentRequests,
      friends,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== ACCEPT FRIEND REQUEST ====================

export const acceptFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.id;
    const requestUserId = req.params.id;

    const friendship = await Friendship.findOne({
      sender: requestUserId,
      receiver: currentUserId,
      status: "pending",
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    friendship.status = "accepted";

    await friendship.save();

    return res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
      friendship,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== REJECT FRIEND REQUEST ====================

export const rejectFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.id;
    const requestUserId = req.params.id;

    const friendship = await Friendship.findOne({
      sender: requestUserId,
      receiver: currentUserId,
      status: "pending",
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    friendship.status = "rejected";

    await friendship.save();

    return res.status(200).json({
      success: true,
      message: "Friend request rejected successfully",
      friendship,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== UNFRIEND ====================

export const unfriendUser = async (req, res) => {
  try {
    const currentUserId = req.id;
    const targetUserId = req.params.id;

    const friendship = await Friendship.findOne({
      $or: [
        {
          sender: currentUserId,
          receiver: targetUserId,
        },
        {
          sender: targetUserId,
          receiver: currentUserId,
        },
      ],
      status: "accepted",
    });

    if (!friendship) {
      return res.status(400).json({
        success: false,
        message: "You are not friends with this user",
      });
    }

    await Friendship.findByIdAndDelete(
      friendship._id
    );

    return res.status(200).json({
      success: true,
      message: "Unfriended successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== SEARCH USERS ====================

export const searchUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find({
      $or: [
        {
          firstname: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastname: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    }).select("-password");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

