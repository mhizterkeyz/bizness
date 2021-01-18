import { JSONUser } from '@user/interfaces';

export interface LoggedInJSONUser extends JSONUser {
  accessToken: string;
}
