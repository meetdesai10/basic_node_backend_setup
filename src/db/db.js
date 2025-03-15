const { default: mongoose } = require("mongoose");
const DB_URL = process.env.DB_URL;
async function DBCONNECT() {
  await mongoose.connect(`${DB_URL}`, { autoIndex: false });
}
module.exports = { DBCONNECT };
