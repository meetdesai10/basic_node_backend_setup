const { user } = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const ThrowError = require("../utils/throwError");
const fs = require("fs");
// register
async function register(req, res) {
  const { email, fullName, mobile, password } = req.body;
  // check fields
  if (!email || !fullName || !mobile || !password) {
    return ThrowError(400, "All fields are required.");
  }
  // create user in db
  const createUser = await user.create({
    fullName,
    email,
    mobile,
    password,
  });
  if (!createUser) {
    return ThrowError(400, "User not found.");
  }
  // generate token
  const generateToken = await createUser.generateAccesstoken();
  // send reponse
  return apiResponse(res, 200, "user register successfully.", {
    user: createUser,
    token: generateToken,
  });
}
// login
async function login(req, res) {
  const { email, password } = req.body;
  // check fields
  if (!email || !password) {
    return ThrowError(400, "All fields are required.");
  }
  // get user
  const isUser = await user.findOne({ email });
  if (!isUser) {
    return ThrowError(404, "User not found please register your self.");
  }
  // check password
  const isPasswordCorrect = await isUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return ThrowError(400, "Incorrect password.");
  }
  // generate token
  const generateToken = await isUser.generateAccesstoken();
  // send response
  return apiResponse(res, 200, "User logged in.", {
    user: isUser,
    token: generateToken,
  });
}
// get user
async function getUser(req, res) {
  return apiResponse(res, 200, "User found", { user: req.user });
}
// dynamic file uploads
function handleProfilePhoto(req, res) {
  const profilePhoto = req.files?.profile;
  console.log(
    "🚀 ~ handleProfilePhoto ~ req.files?.profile:",
    req.files?.profile
  );
  // do work like store image or upload another platform like cloudnary
  // fs.unlinkSync(profilePhoto);
  apiResponse(res, 200, "profile", {
    photos: profilePhoto,
  });
}
// single file upload
function singleFileUpload(req, res) {
  const profilePhoto = req.file
  console.log("🚀 ~ singleFileUpload ~ profilePhoto:", profilePhoto)
  apiResponse(res, 200, "image", {
    photos: profilePhoto,
  });
}
// ultiple file upload
function multipleFileUpload(req, res) {
  const profilePhoto = req.files
  console.log("🚀 ~ singleFileUpload ~ profilePhoto:", profilePhoto)
  apiResponse(res, 200, "image", {
    photos: profilePhoto,
  });
}
module.exports = {
  register,
  login,
  getUser,
  handleProfilePhoto,
  singleFileUpload,
  multipleFileUpload
};
