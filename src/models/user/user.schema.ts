import { Schema } from 'mongoose';

import { UserDocument } from './interfaces';

export const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
    },
    username: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: any): void => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  },
);
