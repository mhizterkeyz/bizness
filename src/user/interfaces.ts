export interface User {
  readonly id: string;

  name: string;
  username?: string;
  email: string;
  password: string;

  isDeleted?: Boolean;
}
