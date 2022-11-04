import { IAuthenticationRepository } from '../../domain/auth/authenticationRepository';
import { IUsersRepository } from '../../domain/users/usersRepository';

export interface IRepositories {
  authenticationRepository: IAuthenticationRepository,
  usersRepository: IUsersRepository,
}
