const { Router } = require("express");
const userController = require("../controllers/user.controller");
const authUser = require("../middleware/auth.user");
const { asyncHandler } = require("../utils/asyncHandler");
const { upload } = require("../middleware/multer");
const router = Router();

// register user
router.route("/userRegister").post(asyncHandler(userController.register));
router.route("/userLogin").post(asyncHandler(userController.login));
router.route("/user").get(authUser, asyncHandler(userController.getUser));

// upload file
router.route("/upload-photo").post(
  upload.fields([
    {
      name: "profile",
      maxCount: 1,
    },
  ]),
  asyncHandler(userController.handleProfilePhoto)
);

module.exports = router;
