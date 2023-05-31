const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const { User } = require("../models/User.js");


// @desc      register new user
// @route     POST /api/users/register
// @access    Public
const registerUser = expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password, displayName } = req.body;

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
    })

    if (user) {
        res.status(201).json({
            message: "success",
            data: {
                _id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email
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
        // generate token
        generateToken(res, user._id);
        // console.log("user id:", user._id, "\n\n\n");

        res.status(200).json({
            message: "success",
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email
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
const getUser = expressAsyncHandler(async (req, res) => {
    const { 
        _id, 
        username, 
        email, 
        firstName, 
        lastName, 
        displayName, 
        phoneNumber,
        address 
    } = await User.findById(req.user.id);
    
    res.status(200).json({ 
        _id,
        username,
        email,
        firstName,
        lastName,
        displayName,
        phoneNumber
    });
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
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.address = req.body.address || user.address;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

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
    if (req.body.userId !== req.params.id) {
        try {
          const user = await User.findById(req.params.id);
          const currentUser = await User.findById(req.body.userId);
          if (!user.followers.includes(req.body.userId)) {
            await user.updateOne({ $push: { followers: req.body.userId } });
            await currentUser.updateOne({ $push: { followings: req.params.id } });
            res.status(200).json("user has been followed");
          } else {
            res.status(403).json("you allready follow this user");
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
    if (req.body.userId !== req.params.id) {
        try {
          const user = await User.findById(req.params.id);
          const currentUser = await User.findById(req.body.userId);
          if (user.followers.includes(req.body.userId)) {
            await user.updateOne({ $pull: { followers: req.body.userId } });
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

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    getUserFriends,
    followUser,
    unFollowUser
}