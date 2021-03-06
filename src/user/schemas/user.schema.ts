import { Schema } from 'mongoose';

import { coordinatesSchema } from '@common/schemas';

export const userSchema = new Schema(
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
    address: String,
    coordinates: coordinatesSchema,
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
        delete ret.coordinates;
        delete ret.isDeleted;
      },
    },
  },
);
