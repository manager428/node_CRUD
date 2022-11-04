import { FilterQuery, PaginateResult } from 'mongoose';
import errors from '../../../common/errors';
import { IUserEntity, UserDao } from '../../infrastructure/db/schemas/User';
import { User } from '../../../domain/users/model';
import { IUsersRepository, IGetUserQuery, ICreateUser, IUpdateUser, IPaginatedUsers } from '../../../domain/users/usersRepository';

interface IUsersRepositoryFactory {
  init(): IUsersRepository;
}

const DEFAULT_PAGINATION_CONTENT: IPaginatedUsers = {
  pagination: {
    total: undefined,
    limit: undefined,
    pages: undefined,
    page: undefined,
  },
  data: [],
};

const queryForGetUser = (query: IGetUserQuery): FilterQuery<typeof UserDao> => {
  const queries: FilterQuery<typeof UserDao> = {};
  if (query.userId) {
    // eslint-disable-next-line no-underscore-dangle
    queries._id = query.userId;
  }
  if (query.email) {
    queries.email = query.email;
  }
  return queries;
};

const handleUsersPaginationResponse = (response: PaginateResult<IUserEntity>): IPaginatedUsers => {
  if (!response || !response.docs || response.docs.length <= 0) {
    return DEFAULT_PAGINATION_CONTENT;
  }
  const postsList: IPaginatedUsers = {
    data: response.docs.map((doc: IUserEntity) => doc.toUser()),
    pagination: {
      total: response.total,
      limit: response.limit,
      page: response.page,
      pages: response.pages,
    },
  };
  return postsList;
};

const userStore: IUsersRepository = {

  async getAllUsers(pageNum: number): Promise<IPaginatedUsers> {
    const userDocs = await UserDao.paginate({}, {
      page: pageNum || 1,
      limit: 25,
      sort: { created: -1 },
    });
    return handleUsersPaginationResponse(userDocs);
  },

  async getUser(query: IGetUserQuery): Promise<User> {
    const userDoc = await UserDao.findOne(queryForGetUser(query));
    if (!userDoc) {
      throw new errors.NotFound('User not found.');
    }
    return userDoc.toUser();
  },
  async createUser(createUserDto: ICreateUser): Promise<User> {
    let userModel = new UserDao(createUserDto);
    userModel = await userModel.save();
    return userModel.toUser();
  },
  async updateUser(userId: string, updateUserDto: IUpdateUser): Promise<User> {
    let newUser = await UserDao.findByIdAndUpdate(userId, updateUserDto);
    if (!newUser) {
      throw new errors.NotFound('User not found.');
    }
    return newUser.toUser();
  },

  async deleteUser(userId: string): Promise<any> {
    let result = await UserDao.findByIdAndRemove(userId);
    if (!result) throw new errors.NotFound('User not found.');
    return {
      status: 'Success',
      message: "Successfully deleted"
    };
  }
};

export const usersRepositoryFactory: IUsersRepositoryFactory = {
  init(): IUsersRepository {
    return Object.create(userStore);
  },
};
