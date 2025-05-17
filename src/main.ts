import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { projectTable, userTable } from './db/schema.js';
import { sql } from 'drizzle-orm'
import { readSchematic } from './schematics/spongeV3Schematicreader.js';
import * as fs from 'node:fs';
import { Schem } from './schematics/Schematic.js';
import { createDiff } from './schematics/Schemdiff.js';
import { JSDOM } from 'jsdom';
import { startServer } from './mcserver/mcserver.js';

export const db = drizzle(process.env.DB_FILE_NAME!);

const dom = new JSDOM('', {
  url: "http://localhost",  // Provide a URL if needed
  runScripts: "dangerously",
  resources: "usable"
});

const { window } = dom;
//@ts-ignore
global.window = window;
global.document = window.document;
global.Image = window.Image;
global.fetch = fetch;


startServer()

async function testSchem(){
  let temp = fs.readFileSync("clipboard(19).schem")
  let schem : Schem =  await readSchematic(temp)



  console.log(createDiff(schem,schem))


}

testSchem()

try {
  await db.run("ALTER TABLE Project ADD COLUMN description VARCHAR");
  console.log("Column added successfully");
} catch (error) {
  console.error("Error adding column:", error.message);
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
