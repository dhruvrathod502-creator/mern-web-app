import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Bio } from "../models/userbio.model.js";
import { populate } from "dotenv";


export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender, dateOfBirth } =
      req.body;

    const existingUser = await User.findOne({ email: email });

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check the existing user with this email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
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

export const logoutUser = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: "user",
            select: "firstname lastname profilePicture",
          },
          {
            path: "comments",
            populate: {
              path: "userId",
              select: "firstname lastname profilePicture",
            },
          },
        ],
      })
      .populate({ path: "bio" });
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

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
    //upload to cloudinary
    const result = await cloudinary.uploader.upload(fileUri);

    //update user document
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { returnDocument: "after" },
    );
    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

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
    //upload to cloudinary
    const result = await cloudinary.uploader.upload(fileUri);

    //update user document
    const user = await User.findByIdAndUpdate(
      userId,
      { coverPhoto: result.secure_url },
      { returnDocument: "after" },
    );
    res.status(200).json({
      success: true,
      message: "Cover photo updated successfully",
      coverPhoto: user.coverPhoto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

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

    let bio = await Bio.findOne({ user: userId });

    if (!bio) {
      bio = new Bio({
        user: userId,
      });
    }

    if (bioText !== undefined) bio.bioText = bioText;
    if (liveIn !== undefined) bio.liveIn = liveIn;
    if (relationship !== undefined) bio.relationship = relationship;
    if (workplace !== undefined) bio.workplace = workplace;
    if (education !== undefined) bio.education = education;
    if (phone !== undefined) bio.phone = phone;
    if (hometown !== undefined) bio.hometown = hometown;

    await bio.save();

    const user = await User.findById(userId);

    if (!user.bio || user.bio.toString() !== bio._id.toString()) {
      user.bio = bio._id;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Bio updated successfully",
      bio,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating bio",
      error: error.message,
    });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.id);

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
    });
  }
};

export const sendFriendRequest = async (req, res) =>{
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.id;

    if(targetUserId === currentUserId.toString()){
      return res.status(400).json({
        success:false,
        message: "You can't send friend request to yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUser.friends.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends",
      });
    }

    if (currentUser.sentRequests.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent",
      });
    }

    currentUser.sentRequests.push(targetUserId);
    targetUser.friendRequests.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success:false,
      message : "Server error"
    });
  }
}

export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.id)
      .populate(
        "friendRequests",
        "firstname lastname email profilePicture"
      )
      .populate(
        "friends",
        "firstname lastname email profilePicture"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,

      // Friend requests
      requests: user.friendRequests,

      // Actual friends
      friends: user.friends,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const requestUserId = req.params.id;
    const currentUserId = req.id;

    const currentUser = await User.findById(currentUserId);
    const requestUser = await User.findById(requestUserId);

    if (!currentUser || !requestUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.friendRequests.includes(requestUserId)) {
      return res.status(400).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (!currentUser.friends.includes(requestUserId)) {
      currentUser.friends.push(requestUserId);
    }

    if (!requestUser.friends.includes(currentUserId)) {
      requestUser.friends.push(currentUserId);
    }

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== requestUserId.toString()
    );

    requestUser.sentRequests = requestUser.sentRequests.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await requestUser.save();

    return res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const requestUserId = req.params.id;
    const currentUserId = req.id;

    const currentUser = await User.findById(currentUserId);
    const requestUser = await User.findById(requestUserId);

    if (!currentUser || !requestUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.friendRequests.includes(requestUserId)) {
      return res.status(400).json({
        success: false,
        message: "Friend request not found",
      });
    }

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== requestUserId.toString()
    );

    requestUser.sentRequests = requestUser.sentRequests.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await requestUser.save();

    return res.status(200).json({
      success: true,
      message: "Friend request rejected successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const unfriendUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.friends.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "You are not friends with this user",
      });
    }

    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== targetUserId.toString()
    );

    targetUser.friends = targetUser.friends.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "Unfriended successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find({
      $or: [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
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
    });
  }
};