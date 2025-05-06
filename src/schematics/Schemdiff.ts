import { Schem } from './Schematic.js';

export type Schemdiff = {
  x:number,
  y:number,
  z:number,
  oldBlock:string,
  newBlock:string,
}

export function createDiff(schem:Schem,schem2:Schem):Schemdiff[]{

  if(!sameDimensions(schem,schem2)){
    throw Error("Schematics must be the same size")
  }
  let diffs : Schemdiff[] = [] ;
  for(let x=0; x < schem.getWidth(); ++x){
    for(let y = 0; y < schem.getHeight(); ++y){
      for(let z = 0; z < schem.getLength(); ++z){

        let oldBlock = schem.getBlockAt(x,y,z);
        let newBlock = schem2.getBlockAt(x,y,z);

        if(oldBlock != newBlock){
          diffs.push({
            x,y,z,oldBlock,newBlock
          })
        }

      }
    }
  }
  return diffs;
}

function sameDimensions(schem:Schem,schem2:Schem){
  if(schem.getWidth() != schem2.getWidth()){
    return false;
  }

  if(schem.getLength() != schem2.getLength()){
    return false;
  }

  if(schem.getHeight() != schem.getHeight()){
    return false;
  }
  return true;
}