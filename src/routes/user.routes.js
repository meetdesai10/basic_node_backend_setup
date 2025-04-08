const { Router } = require("express");
const userController = require("../controllers/user.controller");
const authUser = require("../middleware/auth.user");
const { asyncHandler } = require("../utils/asyncHandler");
const { upload } = require("../middleware/multer");
const { uploadSindleFile } = require("../middleware/multer/singlePhoto");
const { uploadMultipleFile } = require("../middleware/multer/multiplePhoto");
const router = Router();
// register user
router.route("/userRegister").post(asyncHandler(userController.register));
router.route("/userLogin").post(asyncHandler(userController.login));
router.route("/user").get(authUser, asyncHandler(userController.getUser));
// upload file with just put limit
router.route("/upload-photo").post(
  upload.fields([
    {
      name: "profile",
      maxCount: 2,
    },
  ]),
  asyncHandler(userController.handleProfilePhoto)
);
// upload only one file
router
  .route("/upload-single")
  .post(uploadSindleFile, asyncHandler(userController.singleFileUpload));
// upload multiple file
router
  .route("/upload-multiple")
  .post(uploadMultipleFile, asyncHandler(userController.multipleFileUpload));
module.exports = router;
