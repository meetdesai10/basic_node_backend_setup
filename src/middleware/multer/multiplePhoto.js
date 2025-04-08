const multer = require("multer");
const { v4: uuid } = require("uuid");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./multipleFiles");
  },
  filename(req, file, cb) {
    // used uid for prevent duplicates image name
    const id = uuid();
    const extName = file?.originalname?.split(".").pop();
    const fileName = `${id}.${extName}`;
    cb(null, fileName);
  },
});

const uploadMultipleFile = multer({ storage }).array("files", 5);
module.exports = { uploadMultipleFile };
