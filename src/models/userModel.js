import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
    },
    posts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'post',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 12);
});

const user = mongoose.model('user', userSchema);

export default user;
