import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Branch, Commit, User } from '../graphql.js';
import { ProjectService } from '../projectservice/project.service.js';
import { UserService } from '../userservice/userservice.service.js';
import { commitTable, userTable } from '../db/schema.js';
import { db } from '../main.js';
import { eq } from 'drizzle-orm';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Resolver("Commit")
export class CommitresolverResolver {
  constructor(private projectService: ProjectService, private userService: UserService) {

  }
  @ResolveField("user")
  @UseGuards(JwtAuthGuard)
  async getCommits(@Parent() parent: Commit) {
    let [user] =  await db.select({id : commitTable.userId}).from(commitTable).where(eq(commitTable.id,parent.id))
    return this.userService.getUser(user.id)
  }




}
