import { Document } from 'mongoose';

import { User } from '@user/interfaces';

export interface UserDocument extends Document, User {}
