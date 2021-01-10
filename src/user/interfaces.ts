interface Base {
  name: string;
  username?: string;
  email: string;
}

export interface UserObject extends Base {
  accessToken?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface User extends Base {
  password: string;
}

export interface UserDocument extends User {
  id: string;
  toJSON: () => UserObject;
}
