import { Inject, Injectable } from '@nestjs/common';

import { USER } from '@constants/index';
import { UserModel } from '@src/models/user/user.model';

@Injectable()
export class UserService {
  constructor(@Inject(USER) private readonly userModel: UserModel) {}
}
