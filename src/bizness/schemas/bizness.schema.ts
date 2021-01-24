import { Schema } from 'mongoose';

import { BIZNESS, USER } from '@constants/index';
import { coordinatesSchema } from '@user/schemas/user.schema';

export const biznessSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: USER,
    },
    coordinates: {
      type: coordinatesSchema,
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
        delete ret.isDeleted;
        delete ret.coordinates;
      },
    },
  },
);

export const biznessRatingsSchema = new Schema(
  {
    ratedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: USER,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    bizness: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: BIZNESS,
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
        delete ret.isDeleted;
      },
    },
  },
);
