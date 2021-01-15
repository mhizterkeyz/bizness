import { JSONUser } from '@src/user/interfaces';

export interface LoggedInJSONUser extends JSONUser {
  accessToken: string;
}
