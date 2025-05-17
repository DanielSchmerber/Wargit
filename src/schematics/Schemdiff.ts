import { Schem } from './Schematic.js';

export type Schemdiff = {
  x:number,
  y:number,
  z:number,
  from:string,
  to:string,
}

export function createDiff(schem:Schem,schem2:Schem):Schemdiff[]{

  if(!sameDimensions(schem,schem2)){
    throw Error("Schematics must be the same size")
  }
  let diffs : Schemdiff[] = [] ;
  for(let x=0; x < schem.getWidth(); ++x){
    for(let y = 0; y < schem.getHeight(); ++y){
      for(let z = 0; z < schem.getLength(); ++z){

        let from = schem.getBlockAt(x,y,z);
        let to = schem2.getBlockAt(x,y,z);

        if(from != to){
          diffs.push({
            x,y,z,from,to
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