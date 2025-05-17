import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { db } from '../main.js';
import { projectTable, userTable } from '../db/schema.js';
import { UserService } from '../userservice/userservice.service.js';
import { Res, UseGuards } from '@nestjs/common';

import { User } from '../graphql.js';
import { ProjectService } from '../projectservice/project.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@Resolver("User")
export class UserResolver {

  constructor(private userService : UserService,private projectService : ProjectService) {


  }



  @Query() // Return type is a single User
  async getUser(@Args("id", { type: () => Number }) id: number) {
    return this.userService.getUser(id);
  }

  @ResolveField("projects") // Return type is an array of projects
  @UseGuards(JwtAuthGuard)
  async getProjects( @CurrentUser() user: any,@Parent() parent: User) {
    console.log("Resolving projects" + JSON.stringify(user)) ;

    if(parent.id != user.id){
      throw Error("you cant snoop here")
    }

    return this.projectService.getProjectsOfUser(parent.id);
  }
/**
  @Mutation() // Explicitly set return type
  async createUser(@Args("name", { type: () => String }) name: string) {
    return this.userService.createUser(name,"test");
  }
**/


}
