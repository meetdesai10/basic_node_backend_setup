const { Router } = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const pumpfunController = require("../controllers/pumpfun.controller");
const router = Router();

router
  .route("/getPumpfundata")
  .get(asyncHandler(pumpfunController.getPumpfunData));
module.exports = router;
