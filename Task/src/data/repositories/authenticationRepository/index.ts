import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Token } from '../../../domain/token/model';
import errors from '../../../common/errors';
import { IAuthenticationRepository, IRegisterAdminDto } from '../../../domain/auth/authenticationRepository';
import { Admin } from '../../../domain/auth/model';
import { AdminDao } from '../../infrastructure/db/schemas/Admin';
import logging from '../../../common/logging';
import configuration from '../../../configuration';
import { USER_ROLE, USER_TOKEN_EXPIRATION } from '../../../common/constants';
import * as jose from 'jose';
import { createSecretKey } from 'crypto';
import fs from 'fs';

const SALT_ROUNDS = 10;

const privateKey = fs.readFileSync('src/configuration/private.pem', 'utf-8');

interface IAuthenticationRepositoryFactory {
  init(): IAuthenticationRepository;
}

export const authenticationRepositoryFactory: IAuthenticationRepositoryFactory = {
  init(): IAuthenticationRepository {
    async function comparePassword(password: string, dbPassword: string): Promise<boolean> {
      try {
        const match = await bcrypt.compare(password, dbPassword);
        if (!match) {
          throw new Error('Authentication error');
        }
        return match;
      } catch (error) {
        throw new errors.Unauthorized('Wrong password.');
      }
    }

    async function hashPassword(password: string): Promise<string> {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      return bcrypt.hash(password, salt);
    }

    async function registerAdmin(registerAdminDto: IRegisterAdminDto): Promise<Admin> {
      let oldAdmin = await AdminDao.findOne({});
      if (oldAdmin) new errors.Conflict("Admin already exists");
      let adminModel = new AdminDao(registerAdminDto);
      adminModel = await adminModel.save();
      return adminModel.toAdmin();
    }

    async function createAdminToken(admin: Admin): Promise<Token> {
      logging.info('Create consultant token called');
      const token = {
        accessToken: jwt.sign({
          _id: admin.id,
        }, privateKey, {
          algorithm: 'RS512',
          expiresIn: USER_TOKEN_EXPIRATION,
        }),
        tokenType: 'Bearer',
        roles: [USER_ROLE],
        expiresIn: USER_TOKEN_EXPIRATION,
      };
      return new Token(token.accessToken, token.tokenType, token.expiresIn, token.roles);
    }

    async function verifyToken(token: string, secret: string): Promise<JwtPayload> {
      return jwt.verify(token, secret);
    }

    async function getAdminByEmail(email: string): Promise<Admin> {
      let admin = await AdminDao.findOne({ email });
      if (!admin) throw new errors.NotFound('Admin not found.');
      return admin.toAdmin();
    }

    async function getAdminInfo(): Promise<Admin> {
      let admin = await AdminDao.findOne({});
      if (!admin) throw new errors.NotFound('Admin not found.');
      return admin.toAdmin();
    }

    return {
      verifyToken,
      comparePassword,
      hashPassword,
      registerAdmin,
      createAdminToken,
      getAdminByEmail,
      getAdminInfo
    };
  },
};
