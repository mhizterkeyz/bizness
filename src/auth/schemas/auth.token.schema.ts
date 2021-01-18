import { Schema } from 'mongoose';
import { AuthTokenTypes } from '../interfaces';

export const authTokenSchema = new Schema(
  {
    tokenType: {
      type: String,
      required: true,
      enum: AuthTokenTypes,
    },
    tokenExpires: {
      type: Date,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    meta: Object,
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
      },
    },
  },
);
