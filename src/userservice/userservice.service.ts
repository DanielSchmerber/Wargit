import { Injectable } from '@nestjs/common';
import { db } from '../main.js';
import { userTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {

  getUsers(){
    return db.select().from(userTable)
  }

  async getUser(id:number){
    let [temp] = await db.select().from(userTable).where(eq(userTable.id,id))
    return temp
  }

  async createUser(name:string){
    let [newUser] = await db.insert(userTable).values(
      { name: name },
    ).returning().values()
    return newUser
  }

}
