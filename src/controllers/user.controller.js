const { user } = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const { getDataUri } = require("../utils/bufferGenerater");
const ThrowError = require("../utils/throwError");
const fs = require("fs");
const cloudinary = require("cloudinary");
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
  // do work like store image or upload another platform like cloudnary
  // fs.unlinkSync(profilePhoto);
  apiResponse(res, 200, "profile", {
    photos: profilePhoto,
  });
}
// single file upload
async function singleFileUpload(req, res) {
  const fileRaw = req.file;
  const fileBuffer = await getDataUri(fileRaw);
  const uploadCould = await cloudinary.v2.uploader.upload(fileBuffer?.content);
  apiResponse(res, 200, "image", {
    file: {
      url: uploadCould?.url,
      file_id: uploadCould.public_id,
    },
  });
}
// ultiple file upload
async function multipleFileUpload(req, res) {
  const filesRaw = req.files;
  const fileBuffer = await Promise.all(
    filesRaw?.map(async (item) => {
      const buffer = await getDataUri(item);
      const upload = await cloudinary.v2.uploader.upload(buffer.content);
      return { url: upload.url, img_id: upload.public_id };
    })
  );
  apiResponse(res, 200, "image", {
    files: fileBuffer,
  });
}
module.exports = {
  register,
  login,
  getUser,
  handleProfilePhoto,
  singleFileUpload,
  multipleFileUpload,
};
