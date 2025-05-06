import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Branch } from '../graphql.js';
import { ProjectService } from '../projectservice/project.service.js';
import { UserService } from '../userservice/userservice.service.js';

@Resolver("Branch")
export class BranchresolverResolver {

  constructor(private projectService: ProjectService, private userService: UserService) {

  }
  @ResolveField("commits")
  async getCommits(@Parent() parent: Branch) {
    console.log("Resolving commits")
    console.log(parent)
    let commits = await this.projectService.getCommitsOfBranch(parent.id)
    console.log(commits)
    return commits
  }
}
