import { Schema } from 'mongoose';

import { UserDocument } from './interfaces';

export const userSchema = new Schema<UserDocument>(
  {
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
        delete ret.password;
      },
    },
  },
);
