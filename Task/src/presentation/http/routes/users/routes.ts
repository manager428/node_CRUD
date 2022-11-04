import express, { Response, Router } from 'express';
import {
  validateUserToken,
  validate,
  validateCreateUserBody,
} from '../../middleware/endpointValidator';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { GetUserQuery } from '../../../../domain/users/service';
import { IServices } from '../../../../common/interfaces/IServices';
import { IExpressRequest } from '../../../../common/interfaces/IExpressRequest';

const router = express.Router({ mergeParams: true });

interface IUsersRouter {
  init(services: IServices): Router;
}

export const usersRouter: IUsersRouter = {
  init(services: IServices) {
    router.get(
      '/all',
      validate,
      asyncWrapper(async (req: IExpressRequest, res: Response) => {
        let result = await services.usersService.getAllUsers(req.body.pageNum);

        return res.send({
          pagination: result.pagination,
          data: result.data.map(user => user.toUserResponse()),
        });
      }),
    );

    router.get(
      '/:userId',
      validate,
      asyncWrapper(async (req: IExpressRequest, res: Response) => {
        const result = await services.usersService.getUser({
          userId: req.params.userId,
        } as GetUserQuery);
        return res.send({
          data: {
            ...result.user.toUserResponse(),
          },
        });
      }),
    );



    router.post(
      '/',
      validateCreateUserBody(),
      validate,
      asyncWrapper(async (req: IExpressRequest, res: Response) => {
        const user = await services.usersService.createUser({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        });
        return res.send({
          data: user.toUserResponse(),
        });
      }),
    );

    router.put(
      '/:userId',
      validateCreateUserBody(),
      validate,
      asyncWrapper(async (req: IExpressRequest, res: Response) => {
        const user = await services.usersService.updateUser(req.params.userId, {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        });
        return res.send({
          data: user.toUserResponse(),
        });
      }),
    );

    router.delete(
      '/:userId',
      validateCreateUserBody(),
      validate,
      asyncWrapper(async (req: IExpressRequest, res: Response) => {
        const result = await services.usersService.deleteUser(req.params.userId);
        return res.send({
          data: result,
        });
      }),
    );

    return router;
  },
};
