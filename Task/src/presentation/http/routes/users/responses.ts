import { IPagination } from "../../../../common/interfaces/IPagination";

/**
  * This is the user response.
  * Added in order to avoid return password as response.
  * Password is property of our business model in domain layer.
*/
export class UserResponse {
  readonly id: string;

  readonly username: string;

  readonly email: string;

  readonly created: Date;

  constructor(_id: string, username: string, email: string, created: Date) {
    this.id = _id;
    this.username = username;
    this.email = email;
    this.created = created;
  }
}

export interface IUsersResponse {
  pagination: IPagination;
  data: UserResponse[];
}