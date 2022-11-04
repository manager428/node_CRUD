import moment from 'moment';
import bcrypt from 'bcryptjs';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate';
import mongoose, {
  PaginateModel,
  Document,
  model,
  Schema,
} from 'mongoose';
import { User } from '../../../../domain/users/model';

import cipher from '../../../../common/utils/aes-cipher';
import configuration from '../../../../configuration';

const aes_cipher = cipher(configuration.AES_SECRET_KEY);

export interface IDocumentUser extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  created: Date;
}

export interface IUserEntity extends IDocumentUser {
  toUser(): User;
}

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  created: Date,
});

UserSchema.index({ name: 1 });

UserSchema.index({ name: 1, created: -1 });

UserSchema.plugin(mongoosePaginate);

UserSchema.plugin(uniqueValidator);

UserSchema.methods.toUser = function toUser(): User {
  return new User(this._id, this.username, this.email, this.password, this.created);
};

UserSchema.path('email').get(function (email: string) {
  const dec_obj: { enc: string, iv: { type: string, data: Buffer; }, authTag: { type: string, data: Buffer; }; } = JSON.parse(email);
  const dec_email = aes_cipher.decrypt(dec_obj.enc, new Buffer(dec_obj.iv.data), new Buffer(dec_obj.authTag.data));
  return dec_email;
});

UserSchema.path('username').get(function (username: string) {
  const dec_obj: { enc: string, iv: { type: string, data: Buffer; }, authTag: { type: string, data: Buffer; }; } = JSON.parse(username);
  const dec_username = aes_cipher.decrypt(dec_obj.enc, new Buffer(dec_obj.iv.data), new Buffer(dec_obj.authTag.data));
  return dec_username;
});

UserSchema.path('email').set(function (email: string) {
  const enc_email = JSON.stringify(aes_cipher.encrypt(email));
  return enc_email;
});

UserSchema.path('username').set(function (username: string) {
  const enc_username = JSON.stringify(aes_cipher.encrypt(username));
  return enc_username;
});

UserSchema.pre('save', function (next) {
  this.created = moment().toJSON();
  bcrypt.genSalt(10, (err: Error, salt: string) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(this.password, salt, (error: Error, hash: string) => {
      if (error) {
        return next(error);
      }
      this.password = hash;
      this.created = moment().toJSON();
      return next();
    });
  });
});

interface IUserDao<T extends Document> extends PaginateModel<T> { }

export const UserDao: IUserDao<IUserEntity> = mongoose.model<IUserEntity>('User', UserSchema) as IUserDao<IUserEntity>;
