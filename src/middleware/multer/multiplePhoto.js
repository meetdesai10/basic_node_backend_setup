const multer = require("multer");
const { v4: uuid } = require("uuid");
// when you want to store in disk in your server then used diskStorage other wise like you want to save in another cloud platform so use memory storage 
// for save in anohter cloud 
const storage = multer.memoryStorage({
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
// for store in server 
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "./multipleFiles");
//   },
//   filename(req, file, cb) {
//     // used uid for prevent duplicates image name
//     const id = uuid();
//     const extName = file?.originalname?.split(".").pop();
//     const fileName = `${id}.${extName}`;
//     cb(null, fileName);
//   },
// });

const uploadMultipleFile = multer({ storage }).array("files", 5);
module.exports = { uploadMultipleFile };
