/* eslint-disable no-underscore-dangle */
import passwordComplexity from 'joi-password-complexity';
import { Response, NextFunction } from 'express';
import {
  body,
  param,
  validationResult,
} from 'express-validator';
import { errorHandler } from '../routes/errors/routes';
import errors from '../../../common/errors';
import {
  PASSWORD_COMPLEXITY,
} from '../../../common/constants';
import { IExpressRequest } from '../../../common/interfaces/IExpressRequest';

const isMongoObjectID = (value: string): boolean => /^[0-9a-fA-F]{24}$/.test(value);

const requireSameUser = () => [
  param('userId')
    .exists()
    .withMessage('You can manage a user doc for your own user;')
    .custom((value, { req }) => {
      if (value !== req.user._id) {
        return false;
      }
      return true;
    })
    .withMessage({
      message: 'You can manage a user doc for your own user;',
      status: 403,
    }),
];

const requireValidUserBody = () => {
  let passwordErrorMsg: string | null;
  return [
    body('email')
      .exists()
      .isEmail()
      .withMessage({
        message: 'email not provided. Make sure you have a "email" property in your body params.',
        status: 400,
      }),
    body('username')
      .exists()
      .withMessage({
        message: 'username not provided. Make sure you have a "username" property in your body params.',
        status: 400,
      }),
    body('password')
      .exists()
      .withMessage({
        message: 'password not provided. Make sure you have a "password" property in your body params.',
        status: 400,
      })
      .custom((value) => {
        const passwordChecking = passwordComplexity(PASSWORD_COMPLEXITY, 'Password').validate(value);
        passwordErrorMsg = passwordChecking && passwordChecking.error && passwordChecking.error.details && Array.isArray(passwordChecking.error.details)
          ? passwordChecking.error.details[0].message
          : null;
        if (passwordErrorMsg) {
          return false;
        }
        return true;
      })
      .withMessage(() => ({
        message: passwordErrorMsg,
        status: 400,
      })),
  ];
};

const requireValidAdminBody = () => {
  let passwordErrorMsg: string | null;
  return [
    body('email')
      .exists()
      .isEmail()
      .withMessage({
        message: 'email not provided. Make sure you have a "email" property in your body params.',
        status: 400,
      }),
    body('fullname')
      .exists()
      .withMessage({
        message: 'fullname not provided. Make sure you have a "fullname" property in your body params.',
        status: 400,
      }),
    body('password')
      .exists()
      .withMessage({
        message: 'password not provided. Make sure you have a "password" property in your body params.',
        status: 400,
      })
      .custom((value) => {
        const passwordChecking = passwordComplexity(PASSWORD_COMPLEXITY, 'Password').validate(value);
        passwordErrorMsg = passwordChecking && passwordChecking.error && passwordChecking.error.details && Array.isArray(passwordChecking.error.details)
          ? passwordChecking.error.details[0].message
          : null;
        if (passwordErrorMsg) {
          return false;
        }
        return true;
      })
      .withMessage(() => ({
        message: passwordErrorMsg,
        status: 400,
      })),
  ];
};

const requireBodyParamsForLogin = () => [
  body('email')
    .exists()
    .isEmail()
    .withMessage({
      message: 'email not provided. Make sure you have a "email" property in your body params.',
      status: 400,
    }),
  body('password')
    .exists()
    .withMessage({
      message: 'password not provided. Make sure you have a "password" property in your body params.',
      status: 400,
    }),
];

const validate = (req: IExpressRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | void => {
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    return next();
  }
  const validationError = validationErrors.array({
    onlyFirstError: true,
  })[0];
  const errMsg = validationError?.msg?.message || 'Bad request';
  const errStatus = validationError?.msg?.status || 400;
  return errorHandler(new errors[errStatus](errMsg, 'BAD_BODY_PARAMS'), req, res, next);
};

const validateCreateUserBody = () => requireValidUserBody();

const validateRegisterAdminBody = () => requireValidAdminBody();

const validateUserToken = () => requireSameUser();

const validateLoginBodyParams = () => requireBodyParamsForLogin();

export {
  validateUserToken,
  validateCreateUserBody,
  validateLoginBodyParams,
  validate,
  validateRegisterAdminBody,
};
