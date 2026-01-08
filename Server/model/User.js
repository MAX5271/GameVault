const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  gameId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
  wantToPlay: [String],
});


userSchema.pre('save', async function (next){
    if(!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async (pwd)=>{
    return await bcrypt.compare(this.password,pwd);
}

module.exports = mongoose.model("User", userSchema);
