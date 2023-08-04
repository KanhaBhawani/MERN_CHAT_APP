// Name
// Email
// Password
// Profile Picture

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


// Creating a User Schema //
const userSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      pic: {
        type: "String",
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    { timestaps: true }
  );


// ------------------------------------- //
// Helper Function while Sign In 
// For matching the Password
// bcrypt used for decoding the encoded password
userSchema.methods.matchPassword = async function (entredPassword) {
    return await bcrypt.compare(entredPassword,this.password);
}



// ------------------------------------- //
// for password encoding
// password should be saved in encoded form
userSchema.pre("save", async function (next) {
    if (!this.isModified) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// ------------- //
const User = mongoose.model("User",userSchema);

module.exports = User;