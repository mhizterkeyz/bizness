export interface UserObject {
  name: string;
  username?: string;
  email: string;
  accessToken?: string;
  isDeleted?: boolean;
}
export interface User extends UserObject {
  password: string;
}

export interface UserDocument extends User {
  id: string;
  toJSON: () => UserObject;
}
