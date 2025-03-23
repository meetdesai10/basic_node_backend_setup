const fs = require("fs");

// sync...
// fs.writeFileSync("./public/text.txt", "hello world.");
// async...
// fs.writeFile("./public/text.txt", "hello world async.", (err) => {});

// read file sync...
// const result = fs.readFileSync("./public/text.txt", "utf-8");
// console.log("🚀 ~ result:", result);

// readfile async...
// fs.readFile("./public/text.txt", "utf-8", (err, result) => {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log(result);
//   }
// });

// append data sync..
fs.appendFileSync(
  "./public/text.txt",
  `${new Date()}\n`
);

// copy file
// fs.copyFileSync("./public/text.txt","./public/copy.txt")

// delete file
// fs.unlinkSync("./public/text.txt");

// file metadata
// console.log(fs.statSync("./public/text.txt"));

// make directory
// fs.mkdirSync("fs-system/meet.txt", { recursive: true });
