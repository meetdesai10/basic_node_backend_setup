const multer = require("multer");
// when you want to store in disk in your server then used diskStorage other wise like you want to save in another cloud platform so use memory storage 
// for save in anohter cloud 
const storage = multer.memoryStorage({
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
// for store in server 
// const storage = multer.memoryStorage({
//   destination(req, file, cb) {
//     cb(null, "./singleFile");
//   },
//   filename(req, file, cb) {
//     // conver name into current time so there is no duplicates 
//     const timestamp = Date.now();
//     const extName = file.originalname.split(".").pop();
//     const filename = `${timestamp}.${extName}`;
//     cb(null, filename);
//   },
// });

const uploadSindleFile = multer({ storage }).single("file");
module.exports = { uploadSindleFile };
