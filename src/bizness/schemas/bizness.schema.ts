import { Schema } from 'mongoose';

import { USER } from '@constants/index';
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
