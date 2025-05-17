
export interface Schem{
  getBlockAt(x:number,y:number,z:number): string
  getWidth():number
  getHeight():number
  getLength():number
}
import varint from 'varint';
function byteArrayToVarintArray (byteArray) {
  const varintArray = []
  let i = 0
  while (i < byteArray.length) {
    let value = 0
    let varintLength = 0
    while (true) {
      value |= (byteArray[i] & 127) << (varintLength++ * 7)
      if (varintLength > 5) throw new Error('VarInt too big (probably corrupted data)')
      if ((byteArray[i++] & 128) !== 128) break
    }
    varintArray.push(value)
  }
  return varintArray
}
export class SchematicV3{



  private pallet : Map<number, string>;
  constructor(private nbt:any) {
    this.pallet = new Map();

    console.log(nbt)

    let tempPallet = nbt.value.Schematic.value.Blocks.value.Palette.value;

    for(const temp in tempPallet){
      this.pallet.set(tempPallet[temp].value,temp)
    }
    //unpack varint array
    this.nbt.value.Schematic.value.Blocks.value.Data.value = byteArrayToVarintArray(this.nbt.value.Schematic.value.Blocks.value.Data.value)
  }

  getBlockAt(x:number,y:number,z:number){
    let index = x + (z+y*this.getLength())*this.getWidth()
    return this.pallet.get(this.nbt.value.Schematic.value.Blocks.value.Data.value[index])??null
  }

  getHeight(){
    return this.nbt.value.Schematic.value.Height.value
  }

  getWidth(){
    return this.nbt.value.Schematic.value.Width.value
  }

  getLength() {
    return this.nbt.value.Schematic.value.Length.value
  }



}