import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { projectMemberTable, projectTable, userTable } from '../db/schema.js';
import { db } from '../main.js';
import { Project} from '../graphql.js'
import { eq } from 'drizzle-orm';
import { ProjectService } from '../projectservice/project.service.js';
import { UserService } from '../userservice/userservice.service.js';
import fs from 'node:fs';
import { Schem } from '../schematics/Schematic.js';
import { readSchematic } from '../schematics/spongeV3Schematicreader.js';
import { createDiff } from '../schematics/Schemdiff.js';
import { SchematicRendererService } from '../schematic-renderer/schematic-renderer.service.mjs';
import { measureExecutionTime } from '../util/Util.js';

@Resolver('Project')
export class ProjectresolverResolver {

  constructor(private projectService: ProjectService, private userService: UserService, private schematicRenderer : SchematicRendererService) {

  }

  @Query()
  async getProjects(){
    /**
    let service = this.schematicRenderer;
    async function testSchem(){
      let temp = fs.readFileSync("wg.schem")
      let schem : Schem =  await readSchematic(temp)



      console.log(createDiff(schem,schem))

      //measureExecutionTime(service.renderScheamtic.bind(service,schem));
    }

    testSchem()
**/
    return this.projectService.getProjects()
  }

  @Query()
  async getProject(@Args("id")id:number){
    let p = await this.projectService.getProjects().where(eq(projectTable.id,id));

    return p[0]
  }

  @ResolveField("members", )
  async getMembers(@Parent() project: Project) {
    console.log("Trying to resolve member")
    return this.projectService.getMembersOfProject(project)
  }

  @ResolveField("owner")
  async getOwner(@Parent() project: Project) {
    console.log("Trying to resolve owner")
    let [owner] = await db.select({id:projectTable.ownerId}).from(projectTable).where(eq(projectTable.id,project.id))
    console.log("Project owned by "+owner.id)
    let user = this.userService.getUser(owner.id)
    console.log(user)
    return user;
  }

  @ResolveField("branches")
  async getBranches(@Parent() project : Project) {
    console.log("Trying to resolve brnaches")

    let temp = await this.projectService.getBranchesOfProject(project)
    console.log("got dto")
    console.log(temp)
    return temp;

  }

  @Mutation("createProject")
  async createProject(@Args("name") name,@Args("descrption") descrption, @Args("owner") ownerID){
    return this.projectService.createProject(name,descrption,ownerID)
  }



}