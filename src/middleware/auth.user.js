const JWT = require("jsonwebtoken");
const { user } = require("../models/user.model");
const JWT_KEY = process.env.JWT_SIGN_KEY;
async function authUser(req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({
        success: false,
        status_code: 401,
        message: "Unauthorized request.",
      });
    }
    const decodeToken = await JWT.verify(token, JWT_KEY);
    if (!decodeToken) {
      return res.status(401).send({
        success: false,
        status_code: 401,
        message: "Unauthorized request.",
      });
    }
    const isUserExist = await user
      .findById(decodeToken?._id)
      .select("-password");
    if (!isUserExist) {
      return res.status(401).send({
        success: false,
        status_code: 401,
        message: "Unauthorized request.",
      });
    }
    req.user = isUserExist;
    next();
  } catch (error) {
    console.log("🚀 ~ authUser ~ error:", error?.message);
    return res.status(401).send({
      success: false,
      status_code: 401,
      message: "Unauthorized request.",
    });
  }
}

module.exports = authUser;
