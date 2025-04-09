const DataUriParser = require("datauri/parser");
const path = require("path");

async function getDataUri(file) {
  const parser = new DataUriParser();
  const extName = await path.extname(file.originalname).toString();
  return await parser.format(extName, file.buffer);
}

module.exports = { getDataUri };
