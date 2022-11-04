import express, { Response, Router } from 'express';
import { IServices } from '../../../../common/interfaces/IServices';
import {
  validateLoginBodyParams,
  validate,
  validateRegisterAdminBody,
} from '../../middleware/endpointValidator';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { IExpressRequest } from '../../../../common/interfaces/IExpressRequest';

// eslint-disable-next-line new-cap
const router = express.Router({ mergeParams: true });

interface IAuthRouter {
  init(services: IServices): Router;
}

export const authRouter: IAuthRouter = {
  init(services: IServices) {
    router.post(
      '/register',
      validateRegisterAdminBody(),
      validate,
      asyncWrapper(async (req: IExpressRequest, res: Response) => {
        const admin = await services.authService.register({
          fullname: req.body.fullname,
          email: req.body.email,
          password: req.body.password,
        });
        return res.send({
          data: admin.toAdminResponse(),
        });
      }),
    );

    router.post(
      '/login',
      validateLoginBodyParams(),
      validate,
      asyncWrapper(async (req: IExpressRequest, res: Response) => {
        const result = await services.authService.login(req.body.email, req.body.password);
        return res.send({
          data: result,
        });
      }),

      router.get(
        '/info',
        asyncWrapper(async (req: IExpressRequest, res: Response) => {
          const userDoc = await services.authService.getInfo();
          return res.send({
            data: userDoc.toAdminResponse(),
          });
        })
      )
    );

    return router;
  },
};
