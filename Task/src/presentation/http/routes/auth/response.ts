/**
  * This is the admin response.
  * Added in order to avoid return password as response.
  * Password is property of our business model in domain layer.
*/
export class AdminResponse {
    readonly id: string;
  
    readonly fullName: string;
  
    readonly email: string;
  
    readonly created: Date;
  
    constructor(_id: string, fullName: string, email: string, created: Date) {
      this.id = _id;
      this.fullName = fullName;
      this.email = email;
      this.created = created;
    }
  }
  
  