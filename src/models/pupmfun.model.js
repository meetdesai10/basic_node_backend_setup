const { default: mongoose } = require("mongoose");

// Define the schema for storing WebSocket data
const dataSchema = new mongoose.Schema({
  data: {
    type: Object,
    //required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, //1 hours
  },
});
// Export the model
const pumpfunModel = mongoose.model("pumpfunModel", dataSchema);
module.exports = { pumpfunModel };
