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

const statusSchema = new Schema({
  gameId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['WANT_TO_PLAY','ON_HOLD','PLAYED','DROPPED'],
    default:'WANT_TO_PLAY'
  }
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
  games: [statusSchema],
  refreshToken: String,
});


userSchema.pre('save', async function (){
    if(!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
    } catch (error) {
        console.log(error);
    }
});

userSchema.methods.comparePassword = async function (pwd){
    return await bcrypt.compare(pwd,this.password);
}

module.exports = mongoose.model("User", userSchema);
