export interface User {
  name: string;
  username?: string;
  email: string;
  password: string;

  isDeleted?: boolean;
}

export interface UserDocument extends User {
  id: string;
}
