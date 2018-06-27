import { Injectable } from '@angular/core';

//Importar el mock
import { USERS } from '../mock/mock-users';
import { User } from '../mock/user';

@Injectable()
export class UserLoginService {

  MOCK_USERS:User[] = USERS;

  constructor() { }

  existUser(user_name:string) :number{

    for(let i=0; i<this.MOCK_USERS.length; i++){
      if(this.MOCK_USERS[i].user_name ===  user_name) return i;

    }
    return -1;
  }

  getUser(index:number): User{
    return this.MOCK_USERS[index];
  }


}
