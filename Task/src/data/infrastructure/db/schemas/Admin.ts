import moment from 'moment';
import bcrypt from 'bcryptjs';
import uniqueValidator from 'mongoose-unique-validator';
import mongoose from 'mongoose';
import { Admin } from '../../../../domain/auth/model';

export interface IDocumentAdmin extends mongoose.Document {
  fullname: string;
  password: string;
  email: string;
  created: Date;
}

export interface IAdminEntity extends IDocumentAdmin {
  toAdmin(): Admin;
}

export const AdminSchema = new mongoose.Schema({
  fullname: {
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

AdminSchema.index({ name: 1 });

AdminSchema.index({ name: 1, created: -1 });

AdminSchema.plugin(uniqueValidator);

AdminSchema.methods.toAdmin = function toAdmin(): Admin {
  return new Admin(this._id, this.fullname, this.email, this.password, this.created);
};

AdminSchema.pre('save', function (next) {
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

export const AdminDao = mongoose.model<IAdminEntity>('Admin', AdminSchema);
