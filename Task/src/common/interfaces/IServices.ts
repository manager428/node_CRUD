import { IAuthService } from '../../domain/auth/service';
import { IUsersService } from '../../domain/users/service';

export interface IServices {
  authService: IAuthService,
  usersService: IUsersService,
};
