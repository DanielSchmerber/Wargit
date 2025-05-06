import { Injectable } from '@nestjs/common';
import { db } from '../main.js';
import { branchTable, commitBranchTable, commitTable, projectMemberTable, projectTable, userTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProjectService {



  getProjects(){
    return db.select().from(projectTable);
  }

  getMembersOfProject(project){
    return db.select().from(projectMemberTable).leftJoin(userTable,eq(projectMemberTable.userId,userTable.id))
  }

  getBranchesOfProject(project){
    return db.select().from(branchTable).where(eq(project.id,branchTable.projectId))
  }

  getProjectsOfUser(ownerId){
    return db.select().from(projectTable).where(eq(projectTable.ownerId,ownerId))
  }

  getCommitsOfBranch(branchID){
    return db.select().from(commitBranchTable).leftJoin(commitTable,eq(commitTable.id,commitBranchTable.commitId)).where(eq(commitBranchTable.branchId,branchID))
  }

  async createProject(name,description,owner){
    const userExists = await db.select().from(userTable).where(eq(userTable.id, owner));
    console.log("user Exists")
    let [newProject] = await db.insert(projectTable).values(
      {
        description:description,
        ownerId:owner,
        name:name,
      }
    ).returning()

    console.log(newProject.ownerId)

    await db.insert(branchTable).values(
      {
        projectId: newProject.id,
        name:"main",
        schematic:"empty"
      }
    ).returning()
  }




}
