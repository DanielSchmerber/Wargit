import { Injectable } from '@nestjs/common';
import { db } from '../main.js';
import { branchTable, commitBranchTable, commitTable, projectMemberTable, projectTable, userTable } from '../db/schema.js';
import { and, eq, or } from 'drizzle-orm';
import { Base64 } from 'js-base64';
import { emptySchematic, readSchematic } from '../schematics/spongeV3Schematicreader.js';
import { SchematicV3 } from '../schematics/Schematic.js';
import { createDiff } from '../schematics/Schemdiff.js';

@Injectable()
export class ProjectService {

  async  hasAccess(userid,projectid) {
    const [hasAccess] = await db
      .select()
      .from(projectTable)
      .leftJoin(projectMemberTable, eq(projectTable.id, projectMemberTable.projectId))
      .where(
        and(
          eq(projectTable.id, projectid),
          or(
            eq(projectTable.ownerId, userid),
            eq(projectMemberTable.userId,userid)
          )
        )
      );

    return hasAccess

  }

  getProjects(){
    return db.select().from(projectTable);
  }

  getProjectByID(id){
    return db.select().from(projectTable).where(eq(projectTable.id,id))
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

  async createProject(name,description,owner,width,height,length){
    const userExists = await db.select().from(userTable).where(eq(userTable.id, owner));
    console.log("user Exists")
    let [newProject] = await db.insert(projectTable).values(
      {
        description:description,
        ownerId:owner,
        name:name,
        width:width,
        height:height,
        length:length,
      }
    ).returning()

    console.log(newProject.ownerId)

    await db.insert(branchTable).values(
      {
        projectId: newProject.id,
        name:"main",
        schematic:"empty",
      }
    ).returning()

    return this.getProjectByID(newProject.id)
  }


  async createDiff(user,projectID,branchID,schematic){
    if(!(await this.hasAccess(user.id,projectID))){
      throw new Error("you cannot push to this Project")
    }
    console.log("access grabted")
    let project = await this.getProjectByID(projectID).get()

    console.log("project found")

    console.log("schematic " + schematic)
    schematic = Buffer.from(Base64.toUint8Array(schematic))
    console.log("schem raw " + schematic)
    let schem =await  readSchematic(schematic)

    console.log("schematic parsed")

    if(schem.getHeight() != project.height){
      throw new Error(`height doesnt match project height! (${project.height} expected, ${schem.getHeight()} found)`)
    }
    if(schem.getWidth() != project.width){
      throw  new Error(`width doesnt match project width! (${project.width} expected, ${schem.getWidth()} found)`)
    }
    if(schem.getLength() != project.length){
      throw new Error(`length doesnt match project length! (${project.length} expected, ${schem.getLength()} found)`)
    }
    console.log("schematic matches expectations")
    let branch =(await  this.getBranchesOfProject(project)).values().filter(x=>x.id == branchID).find(()=>true)

    console.log("got branch")

    let bS = Buffer.from(Base64.toUint8Array(branch.schematic))
    let branchSchem = null;
    try {
      let branchSchem = await readSchematic(bS)
      console.log("read schematic from branch")
    }catch (e){
      console.log("Waning branch schem is not readable. Perhaps this is the first commit")
    }
    branchSchem = branchSchem??await emptySchematic(project.height,project.width,project.length)

    console.log("calculating diff... this might take a while")
    let diff = createDiff(branchSchem,schem)
    console.log("done :D")

    return diff;
  }



}
