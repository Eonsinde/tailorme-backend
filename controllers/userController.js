const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const { User } = require("../models/user.js");
const { generateToken } = require("../utils.js");

// @desc      register new user
// @route     POST /api/users/register
// @access    Public
const registerUser = expressAsyncHandler(async (req, res) => {
    const { username, displayName, email, password } = req.body;

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

    // create user
    const user = await User.create({
        username,
        email,
        displayName: displayName ? displayName : "",
        password,
    })

    if (user) {
        res.status(201).json({
            data: {
                _id: user.id,
                displayName: user.displayName,
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
        res.status(200).json({
            data: {
                _id: user.id,
                displayName: user.displayName,
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
// @route     GET /api/users/:id
// @access    Public
const getUserProfile = expressAsyncHandler(async (req, res) => {
    const { 
        _id, 
        username, 
        email, 
        firstName, 
        lastName, 
        displayName, 
        phoneNumber,
        address,
        isVerified 
    } = await User.findById(req.params.id);

    res.status(200).json({ 
        _id,
        username,
        email,
        firstName,
        lastName,
        displayName,
        phoneNumber,
        address,
        isVerified 
    });
})

// @desc      Get a user
// @route     GET /api/users/me
// @access    Private
const getUser = expressAsyncHandler(async (req, res) => {
    console.log("user:", req.user._id);

    const { 
        _id, 
        username, 
        email, 
        firstName, 
        lastName, 
        displayName, 
        phoneNumber,
        address,
        isVerified 
    } = await User.findById(req.user.id);
    
    res.status(200).json({ 
        _id,
        username,
        email,
        firstName,
        lastName,
        displayName,
        phoneNumber,
        address,
        isVerified 
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



module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getUser,
    updateUser
}