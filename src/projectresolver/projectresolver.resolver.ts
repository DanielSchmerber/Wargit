import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { projectMemberTable, projectTable, userTable } from '../db/schema.js';
import { db } from '../main.js';
import { Project} from '../graphql.js'
import { and, eq, or } from 'drizzle-orm';
import { ProjectService } from '../projectservice/project.service.js';
import { UserService } from '../userservice/userservice.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import fs from 'node:fs';
import { Schem } from '../schematics/Schematic.js';
import { readSchematic } from '../schematics/spongeV3Schematicreader.js';
import { createDiff } from '../schematics/Schemdiff.js';
import { SchematicRendererService } from '../schematic-renderer/schematic-renderer.service.mjs';
import { measureExecutionTime } from '../util/Util.js';

@Resolver('Project')
export class ProjectresolverResolver {

  constructor(
    private projectService: ProjectService, 
    private userService: UserService
  ) {}




  @UseGuards(JwtAuthGuard)
  @Query()
  async getProjects(@CurrentUser() user: any) {
    // Get projects where user is owner or member
    const projects = await db
      .select()
      .from(projectTable)
      .leftJoin(projectMemberTable, eq(projectTable.id, projectMemberTable.projectId))
      .where(
        or(
          eq(projectTable.ownerId, user.id),
          eq(projectMemberTable.userId, user.id)
        )
      );
    
    return projects.map(p => p.Project);
  }

  @UseGuards(JwtAuthGuard)
  @Query()
  async getProject(@Args("id") id: number, @CurrentUser() user: any) {
    // Get project and check if user has access

    console.log(user + " requested " + id)

    const [project] = await db
      .select()
      .from(projectTable)
      .leftJoin(projectMemberTable, eq(projectTable.id, projectMemberTable.projectId))
      .where(
        and(
          eq(projectTable.id, id),
          or(
            eq(projectTable.ownerId, user.id),
            eq(projectMemberTable.userId, user.id)
          )
        )
      );

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return project.Project;
  }

  @UseGuards(JwtAuthGuard)
  @ResolveField("members")
  async getMembers(@Parent() project: Project, @CurrentUser() user: any) {
    // Check if user has access to this project
    const [hasAccess] = await db
      .select()
      .from(projectTable)
      .leftJoin(projectMemberTable, eq(projectTable.id, projectMemberTable.projectId))
      .where(
        and(
          eq(projectTable.id, project.id),
          or(
            eq(projectTable.ownerId, user.id),
            eq(projectMemberTable.userId, user.id)
          )
        )
      );

    if (!hasAccess) {
      throw new Error('Access denied to project members');
    }

    return this.projectService.getMembersOfProject(project);
  }

  @UseGuards(JwtAuthGuard)
  @ResolveField("owner")
  async getOwner(@Parent() project: Project, @CurrentUser() user: any) {
    // Check if user has access to this project
    const [hasAccess] = await db
      .select()
      .from(projectTable)
      .leftJoin(projectMemberTable, eq(projectTable.id, projectMemberTable.projectId))
      .where(
        and(
          eq(projectTable.id, project.id),
          or(
            eq(projectTable.ownerId, user.id),
            eq(projectMemberTable.userId, user.id)
          )
        )
      );

    if (!hasAccess) {
      throw new Error('Access denied to project owner');
    }

    let [owner] = await db.select({id: projectTable.ownerId}).from(projectTable).where(eq(projectTable.id, project.id));
    return this.userService.getUser(owner.id);
  }

  @UseGuards(JwtAuthGuard)
  @ResolveField("branches")
  async getBranches(@Parent() project: Project, @CurrentUser() user: any) {
    // Check if user has access to this project

    const [hasAccess] = await db
      .select()
      .from(projectTable)
      .leftJoin(projectMemberTable, eq(projectTable.id, projectMemberTable.projectId))
      .where(
        and(
          eq(projectTable.id, project.id),
          or(
          eq(projectTable.ownerId, user.id),
          eq(projectMemberTable.userId, user.id)
          )
        )
      );

    if (!hasAccess) {
      throw new Error('Access denied to project branches');
    }

    return this.projectService.getBranchesOfProject(project);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation("createProject")
  async createProject(
    @Args("name") name: string,
    @Args("description") description: string,
    @Args("width") width: number,
    @Args("length") length: number,
    @Args("height") height: number,
    @CurrentUser() user: any
  ) {
    return this.projectService.createProject(name, description, user.id, width, height, length);
  }


  @UseGuards(JwtAuthGuard)
  @Mutation("createDiff")
  async createDiff(@CurrentUser() user:any, @Args("projectID")projectID, @Args("branchID")branchID,@Args("schematic")schematic){



    return this.projectService.createDiff(user,projectID,branchID,schematic)
  }

/**
  @Query()
  async getProjectWithoutGuard(@Args("id")id:number){
    let p = await this.projectService.getProjects().where(eq(projectTable.id,id));

    return p[0]
  }

  @ResolveField("members", )
  async getMembersWithoutGuard(@Parent() project: Project) {
    console.log("Trying to resolve member")
    return this.projectService.getMembersOfProject(project)
  }

  @ResolveField("owner")
  async getOwnerWithoutGuard(@Parent() project: Project) {
    console.log("Trying to resolve owner")
    let [owner] = await db.select({id:projectTable.ownerId}).from(projectTable).where(eq(projectTable.id,project.id))
    console.log("Project owned by "+owner.id)
    let user = this.userService.getUser(owner.id)
    console.log(user)
    return user;
  }

  @ResolveField("branches")
  async getBranchesWithoutGuard(@Parent() project : Project) {
    console.log("Trying to resolve brnaches")

    let temp = await this.projectService.getBranchesOfProject(project)
    console.log("got dto")
    console.log(temp)
    return temp;

  }

  @Mutation("createProjectWithoutGuard")
  async createProjectWithoutGuard(@Args("name") name,@Args("descrption") descrption, @Args("owner") ownerID, @Args("width") width, @Args("length") length, @Args("height") height){
    return this.projectService.createProject(name,descrption,ownerID,width,height,length)
  }
**/
}