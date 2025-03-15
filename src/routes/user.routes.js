const { Router } = require("express");
const userController = require("../controllers/user.controller");
const authUser = require("../middleware/auth.user");
const { asyncHandler } = require("../utils/asyncHandler");
const router = Router();

// register user
router.route("/userRegister").post(asyncHandler(userController.register));
router.route("/userLogin").post(asyncHandler(userController.login));
router.route("/user").get(authUser, asyncHandler(userController.getUser));
router.route("/demo").get(asyncHandler(userController.demo));

module.exports = router;
