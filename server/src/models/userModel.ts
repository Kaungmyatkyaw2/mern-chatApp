import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  password: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  createdAt: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  checkPasswordCorrect: (
    candidatePassword: string,
    actualPassword: string
  ) => Promise<boolean>;
  checkPasswordChanged: (jwtTimeStamp: number) => boolean;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required for an account."],
  },

  email: {
    type: String,
    trim: true,
    required: [true, "Email is required for an account."],
    unique: true,
    validate: {
      //type error
      validator: async (value: string) => {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email.",
    },
  },

  picture: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    select: false,
    minlength: 6,
    maxlength: 25,
    required: [true, "Password is required for an account"],
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, "You have to confirm your password."],
    validate: {
      validator: function (pConfirm: string): boolean {
        return (this as any).password == pConfirm;
      },
      message: "Confirm password must be match with password.",
    },
  },
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

userSchema.methods.checkPasswordCorrect = async function (
  candidatePassword: string,
  actualPassword: string
) {
  return await bcrypt.compare(candidatePassword, actualPassword);
};

userSchema.methods.checkPasswordChanged = function (jwtTimeStamp: number) {
  if (!this.passwordChangedAt) {
    return false;
  }

  const jwtTimeStampMili = jwtTimeStamp * 1000;
  const changedTime = this.passwordChangedAt.getTime();

  return changedTime >= jwtTimeStampMili;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    return next();
  }
  next();
});

export const UserModel = mongoose.model<User>("user", userSchema);
