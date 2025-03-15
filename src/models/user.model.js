const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_SIGN_KEY;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// bcrypt before save password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate access token
userSchema.methods.generateAccesstoken = async function () {
  return JWT.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    JWT_KEY
  );
};

const user = mongoose.model("user", userSchema);
module.exports = { user };
