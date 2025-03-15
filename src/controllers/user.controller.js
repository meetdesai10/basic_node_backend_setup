const { user } = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const ThrowError = require("../utils/throwError");

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

function demo(req, res) {
  if (false) {
    ThrowError(404, "User not found.");
  }
  return apiResponse(res, 200, "User found.", { user: { name: "meet desai" } });
}

module.exports = { register, login, getUser, demo };
