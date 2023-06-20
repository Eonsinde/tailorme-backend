const expressAsyncHandler = require("express-async-handler");
const uploadToCloudinary = require("../middleware/uploadMiddleware");
const { User } = require("../models/user.js");
const { generateToken } = require("../utils.js");


// @desc      register new user
// @route     POST /api/users/register
// @access    Public
const registerUser = expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password, displayName, userType } = req.body;

    if (!email || !username || !password) {
        res.status(400);
        throw new Error("Please fill in all the required fields");
    }
    
    // check to see if user exists
    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
        firstName: firstName ? firstName : "",
        lastName: lastName ? lastName : "",
        username,
        email,
        displayName: displayName ? displayName : "",
        password,
        userType,
    })

    if (user) {
        res.status(201).json({
            data: {
                _id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profilePicture: "",
                userType: user.userType,
            },
            token: generateToken(user._id),
        }) ;
    } else {
        res.status(400);
        throw new Error("Failed to create user");
    }
})

// @desc      Authenticate a user
// @route     POST /api/users/login
// @access    Public
const loginUser = expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // check email
    const user = await User.findOne({ username });

    if (!user) {
        res.status(401);
        throw new Error("Account not found");
    }

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                type: user.userType
            },
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid password");
    }
})

// @desc      Get a user
// @route     GET /api/users/me
// @access    Private
const getUserProfile = expressAsyncHandler(async (req, res) => {
    const { 
        _id, 
        username, 
        email, 
        firstName, 
        lastName, 
        displayName, 
        profilePicture,
        phoneNumber,
        address,
        bio,
        favorites,
        specialties,
        followers,
        userType,
    } = await User.findById(req.user.id);
    
    res.status(200).json({ 
        _id,
        username,
        email,
        firstName,
        lastName,
        displayName,
        profilePicture: profilePicture || "",
        phoneNumber: phoneNumber || "",
        address: address || "",
        bio: bio || "",
        favorites: favorites || [],
        specialties: specialties || [],
        followers: followers || [],
        type: userType,
    });
})

// @desc      Get a user
// @route     GET /api/users/:id
// @access    Public
const getUserById = expressAsyncHandler(async (req, res) => {
    const { 
        _id, 
        username, 
        email, 
        firstName, 
        lastName, 
        displayName, 
        profilePicture,
        phoneNumber,
        address,
        bio,
        favorites,
        specialties,
        followers,
        userType
    } = await User.findById(req.params.id);
    
    res.status(200).json({ 
        _id,
        username,
        email,
        firstName,
        lastName,
        displayName,
        profilePicture: profilePicture || "",
        phoneNumber: phoneNumber || "",
        address: address || "",
        bio: bio || "",
        favorites: favorites || [],
        specialties: specialties || [],
        followers: followers || [],
        type: userType
    });
})

const updateUserAvatar = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const localFilePath = req.file?.path || "";
        const result = await uploadToCloudinary(localFilePath);
        user.username = req.body.username || result.url;
        
        const updatedUser = await user.save();
        res.status(200).json({
            profilePicture: updatedUser.profilePicture,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

// @desc      Update a user
// @route     PUT /api/users/me
// @access    Private
const updateUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        console.log(req.body);
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.displayName = req.body.displayName || user.displayName;
        user.bio = req.body.bio || user.bio;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.address = req.body.address || user.address;
        user.specialties = req.body.specialties || user.specialties;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            displayName: updatedUser.displayName,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

// Get User Friends
const getUserFriends = async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
          user.followings.map((friendId) => {
            return User.findById(friendId);
          })
        );
        let friendList = [];
        friends.map((friend) => {
          const { _id, username, profilePicture } = friend;
          friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
      } catch (err) {
        res.status(500).json(err);
    }
}

// Follow a User
const followUser = async(req, res) => {
    if (req.user._id !== req.params.id) {
        try {
          const user = await User.findById(req.params.id);
          const currentUser = await User.findById(req.user._id);

          if (!user.followers.includes(req.user._id)) {
            await user.updateOne({ $push: { followers: req.user._id } });
            await currentUser.updateOne({ $push: { followings: req.params.id } });
            res.status(200).json("user has been followed");
          } else {
            res.status(403).json("you already follow this user");
          }
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(403).json("you cant follow yourself");
      }
}

// unfollow a user
const unFollowUser = async(req, res) => {
    if (req.user._id !== req.params.id) {
        try {
          const user = await User.findById(req.params.id);
          const currentUser = await User.findById(req.user._id);

          if (user.followers.includes(req.user._id)) {
            await user.updateOne({ $pull: { followers: req.user._id } });
            await currentUser.updateOne({ $pull: { followings: req.params.id } });
            res.status(200).json("user has been unfollowed");
          } else {
            res.status(403).json("you don't follow this user");
          }
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(403).json("you can't unfollow yourself");
    }
}

// @desc      Search a user
// @route     PUT /api/users?query=fiyoupe
// @access    Public
const searchUsers = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.query ? {
        $or: [
            {username: { $regex: req.query.query, $options: "i" }},
            {displayName: { $regex: req.query.query.search, $options: "i" }},
            {email: { $regex: req.query.query, $options: "i" }},
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })

    res.status(200).json(users);
})

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserAvatar,
    getUserById,
    updateUser,
    getUserFriends,
    followUser,
    unFollowUser,
    searchUsers
}