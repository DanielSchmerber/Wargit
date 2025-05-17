import { Injectable } from '@nestjs/common';
import { db } from '../main.js';
import { userTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  getUsers(){
    return db.select().from(userTable)
  }

  async getUser(id:number){
    let [temp] = await db.select().from(userTable).where(eq(userTable.id,id))
    return temp
  }

  async getUserByUsername(username: string) {
    let [user] = await db.select().from(userTable).where(eq(userTable.name, username));
    return user;
  }

  async getUserByEmail(email: string) {
    let [user] = await db.select().from(userTable).where(eq(userTable.email, email));
    return user;
  }

  async createUser(username: string, password: string){
    const hashedPassword = await bcrypt.hash(password, 10);
    let [newUser] = await db.insert(userTable).values(
      { 
        name: username,
        password: hashedPassword
      },
    ).returning();
    return newUser
  }

}
