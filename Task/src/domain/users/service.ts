import { IRepositories } from '../../common/interfaces/IRepositories';
import { User } from './model';
import { ICreateUser, IGetUserQuery, IPaginatedUsers, IUpdateUser } from './usersRepository';

/*
  Here is the core of our application. Here we add our business logic.
  e.g. Lets say that every time that we ask for a user, we need his posts too.
  So we add this logic in domain layer.
*/
export type GetUserQuery = IGetUserQuery;

export interface IUsersService {
  getAllUsers(pageNum: number): Promise<IPaginatedUsers>;
  getUser(query: GetUserQuery): Promise<{ user: User; }>;
  createUser(createUserDto: ICreateUser): Promise<User>;
  updateUser(userId: string, updateUserDto: IUpdateUser): Promise<User>;
  deleteUser(userId: string): Promise<any>;
}

interface IUsersServiceFactory {
  init(repositories: IRepositories): IUsersService;
}

export const usersServiceFactory: IUsersServiceFactory = {
  init(repositories: IRepositories) {

    async function getAllUsers(pageNum: number): Promise<IPaginatedUsers> {
      return repositories.usersRepository.getAllUsers(pageNum);
    }

    async function getUser(query: GetUserQuery): Promise<{
      user: User;
    }> {
      const [
        user,
      ] = await Promise.all([
        repositories.usersRepository.getUser(query as IGetUserQuery),
      ]);
      return {
        user,
      };
    }

    async function createUser(createUserDto: ICreateUser) {
      return repositories.usersRepository.createUser(createUserDto);
    }

    async function updateUser(userId: string, updateUerDto: IUpdateUser) {
      return repositories.usersRepository.updateUser(userId, updateUerDto);
    }

    async function deleteUser(userId: string) {
      return repositories.usersRepository.deleteUser(userId);
    }

    return {
      getUser,
      createUser,
      updateUser,
      deleteUser,
      getAllUsers
    };
  },
};
