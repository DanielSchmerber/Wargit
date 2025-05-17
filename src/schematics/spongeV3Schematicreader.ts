import { Schem, SchematicV3 } from './Schematic.js';
import { Schematic} from  "prismarine-schematic"
import { Vec3 } from "vec3";

var nbt
const promisify = f => (...args) => new Promise((resolve, reject) => f(...args, (err, res) => err ? reject(err) : resolve(res)))

export async function readSchematic(schem: Buffer) : Promise<Schem>{
  if(!nbt){
    nbt = await import("prismarine-nbt")
  }
  let promise = promisify(nbt.parse)
  //test

  try {
    let s = new SchematicV3(await promise(schem));
    return s;
  }catch (e){
    console.log("schematic is not readable with spongeV3, trying fallbacks")
  }

  let prismarine = await Schematic.read(schem);
  console.log("this is probably way way slower")
  return {
    getLength(): number {
      return prismarine.size.z
    },
    getHeight(): number {
      return prismarine.size.y
    },
    getWidth(): number {
      return prismarine.size.x
    },
    getBlockAt(x: number, y: number, z: number): string {
      x += prismarine.offset.x
      y+= prismarine.offset.y
      z += prismarine.offset.z
      return ("minecraft:"+prismarine.getBlock(new Vec3(x,y,z)).name)
    }
  }

}

export async function emptySchematic(height:number,width:number,length:number):Promise<Schem>{
  return {
    getLength(): number {
      return length
    },
    getWidth(): number {
      return width
    },
    getHeight(): number {
      return height
    },
    getBlockAt(x: number, y: number, z: number): string {
      return "minecraft:air"
    }
  }
}

function bufferToBase64(buffer) {
  return buffer.toString('base64');
}

// Function to convert Base64 to Buffer
function base64ToBuffer(base64String) {
  return Buffer.from(base64String, 'base64');
}
