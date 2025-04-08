const { pumpfunModel } = require("../models/pupmfun.model");
const { apiResponse } = require("../utils/apiResponse");
async function getPumpfunData(req, res) {
  const pumpData = await pumpfunModel.find().skip(100849);
  //   const pumpData = await pumpfunModel.find({ "data.MKC": { $gt: 1000 } });
  return apiResponse(res, 200, "Pumpfun data.", {
    data: pumpData,
  });
}
module.exports = { getPumpfunData };