import { IPagination } from '../../common/interfaces/IPagination';
import { User } from './model';

export interface IGetUserQuery {
  email?: string,
  userId?: string;
}

export interface ICreateUser {
  username: string,
  email: string,
  password: string,
}

export interface IUpdateUser {
  username: string,
  email: string,
  password: string,
}

export interface IUsersRepository {
  getUser(query: IGetUserQuery): Promise<User>;
  createUser(createUserDto: ICreateUser): Promise<User>;
  updateUser(userId: string, updateUserDto: IUpdateUser): Promise<User>;
  deleteUser(userId: string): Promise<any>;
  getAllUsers(pageNum: number): Promise<IPaginatedUsers>;
}

export interface IPaginatedUsers {
  pagination: IPagination;
  data: User[];
}