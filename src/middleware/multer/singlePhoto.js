const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./singleFile");
  },
  filename(req, file, cb) {
    // conver name into current time so there is no duplicates 
    const timestamp = Date.now();
    const extName = file.originalname.split(".").pop();
    const filename = `${timestamp}.${extName}`;
    cb(null, filename);
  },
});

const uploadSindleFile = multer({ storage }).single("file");
module.exports = { uploadSindleFile };
