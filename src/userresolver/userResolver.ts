import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { db } from '../main.js';
import { projectTable, userTable } from '../db/schema.js';
import { UserService } from '../userservice/userservice.service.js';
import { Res } from '@nestjs/common';

import { User } from '../graphql.js';
import { ProjectService } from '../projectservice/project.service.js';

@Resolver("User")
export class UserResolver {

  constructor(private userService : UserService,private projectService : ProjectService) {


  }


  @Query() // Return type is an array of User
  async getUsers() {
    return this.userService.getUsers();
  }

  @Query() // Return type is a single User
  async getUser(@Args("id", { type: () => Number }) id: number) {
    return this.userService.getUser(id);
  }

  @ResolveField("projects") // Return type is an array of projects
  async getProjects(@Parent() parent: User) {
    console.log("Resolving projects");
    return this.projectService.getProjectsOfUser(parent.id);
  }

  @Mutation() // Explicitly set return type
  async createUser(@Args("name", { type: () => String }) name: string) {
    return this.userService.createUser(name);
  }


}
