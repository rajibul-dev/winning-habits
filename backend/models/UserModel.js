import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export const defaultImageURL =
  "https://res.cloudinary.com/drtmxi7rn/image/upload/t_no-padding/winning-habits-app/pfps/default-pfp-placeholder.jpg";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is a mandatory field"],
      trim: true,
      minlength: 2,
      maxlength: 40,
    },
    email: {
      unique: true,
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      maxlength: 1024,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    verificationToken: String,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    avatar: {
      type: String,
      default: defaultImageURL,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

export default model("User", UserSchema);
