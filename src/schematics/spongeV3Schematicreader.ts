import { Schem, SchematicV3 } from './Schematic.js';


var nbt
const promisify = f => (...args) => new Promise((resolve, reject) => f(...args, (err, res) => err ? reject(err) : resolve(res)))

export async function readSchematic(schem: Buffer) : Promise<Schem>{
  let temp = schem.toJSON()
  if(!nbt){
    nbt = await import("prismarine-nbt")
  }
  let promise = promisify(nbt.parse)

  return new SchematicV3(await promise(schem));


}

function bufferToBase64(buffer) {
  return buffer.toString('base64');
}

// Function to convert Base64 to Buffer
function base64ToBuffer(base64String) {
  return Buffer.from(base64String, 'base64');
}
