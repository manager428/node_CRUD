import { AdminResponse } from "../../presentation/http/routes/auth/response";
/**
  * This is the app Model it is decoupled from
  * the Entities used for the databse
*/
export class Admin {
    readonly id: string;
  
    readonly fullName: string;
  
    readonly email: string;
  
    readonly password: string;
  
    readonly created: Date;
  
    constructor(_id: string, fullname: string, email: string, password: string, created: Date) {
      this.id = _id;
      this.fullName = fullname;
      this.email = email;
      this.password = password;
      this.created = created;
    }
  
    toAdminResponse(): AdminResponse {
      return new AdminResponse(this.id, this.fullName, this.email, this.created);
    }
  }
  