import { Schema } from 'mongoose';

import { BIZNESS, LISTING, USER } from '@constants/index';

export const listingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
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

export const listingRatingsSchema = new Schema(
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
    listing: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: LISTING,
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
