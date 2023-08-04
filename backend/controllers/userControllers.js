const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const generateToken = require('../config/generateToken');


// ------------- User Registration ------------------ //
//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler( async (req,res) => 
{
    const { name, email, password, pic } = req.body;

    if(!name || !email || !password) {
        res.status(400);
        throw new console.error('Please Enter all the Fields');
    }

    // email should be unique
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // create a user according the userSchema
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    // making the data for database
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token : generateToken(user._id),
        });
        } else {
            res.status(400);
            throw new Error("User not found");
        }

});


// ----------- User Authentication (Login) ------------------- //
//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // find the user through the e-mail (unique)
    const user = await User.findOne({ email });
    // console.log(user);
    // for identifing the user and matching the password
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
  });
  
// --------- Search User ---------- //
//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { allUsers, registerUser, authUser };