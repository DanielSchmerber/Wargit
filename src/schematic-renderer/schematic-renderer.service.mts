import { Injectable } from '@nestjs/common';
import {
  BlockDefinition,
  BlockModel, Identifier,
  ItemModel,
  jsonToNbt,
  NbtTag,
  Resources,
  Structure,
  StructureRenderer, TextureAtlas, upperPowerOfTwo,
} from 'deepslate';
import { mat4 } from 'gl-matrix'
import { createCanvas,ImageData  } from 'canvas';
import gl from 'gl';
import * as fs from 'node:fs';
import { Schem } from '../schematics/Schematic.js';
import { Base64 } from 'js-base64'; // From headless-gl

var res;

@Injectable()
export class SchematicRendererService {
   generateImage(flippedPixels, width, height) {
    // Create a canvas and get the 2D drawing context
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Create an ImageData object using the flippedPixels array
    const imageData = new ImageData(Uint8ClampedArray.from(flippedPixels), width, height);

    // Put the image data on the canvas at the (0, 0) position
    ctx.putImageData(imageData, 0, 0);

    // Write the canvas to a PNG file synchronously
    const buffer = canvas.toBuffer('image/png'); // Get the PNG data as a buffer
    return Base64.fromUint8Array(buffer)
  }
  async fetchResources(){

    let resources : Resources = null;

    const MCMETA = 'https://raw.githubusercontent.com/misode/mcmeta/'

    await Promise.all([
      fetch(`${MCMETA}registries/item/data.min.json`).then(r => r.json()),
      fetch(`${MCMETA}summary/assets/block_definition/data.min.json`).then(r => r.json()),
      fetch(`${MCMETA}summary/assets/model/data.min.json`).then(r => r.json()),
      fetch(`${MCMETA}summary/assets/item_definition/data.min.json`).then(r => r.json()),
      fetch(`${MCMETA}summary/item_components/data.min.json`).then(r => r.json()),
      fetch(`${MCMETA}atlas/all/data.min.json`).then(r => r.json()),
      new Promise<HTMLImageElement>(res => {
        const image = new Image()
        image.onload = () => res(image)
        image.crossOrigin = 'Anonymous'
        image.src = `${MCMETA}atlas/all/atlas.png`
      }),
    ]).then(([items, blockstates, models, item_models, item_components, uvMap, atlas]) => {

      // === Prepare assets for item and structure rendering ===

      const itemList = document.createElement('datalist')
      itemList.id = 'item-list'
      items.forEach(item => {
        const option = document.createElement('option')
        option.textContent = item
        itemList.append(option)
      })
      document.getElementById('item-input')?.after(itemList)

      const blockDefinitions: Record<string, BlockDefinition> = {}
      Object.keys(blockstates).forEach(id => {
        blockDefinitions['minecraft:' + id] = BlockDefinition.fromJson(blockstates[id])
      })

      const blockModels: Record<string, BlockModel> = {}
      Object.keys(models).forEach(id => {
        blockModels['minecraft:' + id] = BlockModel.fromJson(models[id])
      })
      Object.values(blockModels).forEach((m: any) => m.flatten({ getBlockModel: id => blockModels[id] }))


      const itemModels: Record<string, ItemModel> = {}
      Object.keys(item_models).forEach(id => {
        itemModels['minecraft:' + id] = ItemModel.fromJson(item_models[id].model)
      })

      const itemComponents: Record<string, Map<string, NbtTag>> = {}
      Object.keys(item_components).forEach(id => {
        const components = new Map<string, NbtTag>()
        Object.keys(item_components[id]).forEach(c_id => {
          components.set(c_id, jsonToNbt(item_components[id][c_id]))
        })
        itemComponents['minecraft:' + id] = components
      })

      const atlasCanvas = document.createElement('canvas')
      const atlasSize = upperPowerOfTwo(Math.max(atlas.width, atlas.height))
      atlasCanvas.width = atlasSize
      atlasCanvas.height = atlasSize
      const atlasCtx = atlasCanvas.getContext('2d')!
      atlasCtx.drawImage(atlas, 0, 0)


      const atlasData = atlasCtx.getImageData(0, 0, atlasSize, atlasSize)



      const idMap = {}
      Object.keys(uvMap).forEach(id => {
        const [u, v, du, dv] = uvMap[id]
        const dv2 = (du !== dv && id.startsWith('block/')) ? du : dv
        idMap[Identifier.create(id).toString()] = [u / atlasSize, v / atlasSize, (u + du) / atlasSize, (v + dv2) / atlasSize]
      })
      const textureAtlas = new TextureAtlas(atlasData, idMap)

      resources = {
        getBlockDefinition(id) { return blockDefinitions[id.toString()] },
        getBlockModel(id) { return blockModels[id.toString()] },
        getTextureUV(id) { return textureAtlas.getTextureUV(id) },
        getTextureAtlas() { return textureAtlas.getTextureAtlas() },
        getBlockFlags(id) { return { opaque: false } },
        getBlockProperties(id) { return null },
        getDefaultBlockProperties(id) { return null },
      }
  });
    return resources;
  }

  async renderScheamtic(schematic :Schem){

    const structure = new Structure([schematic.getWidth(),schematic.getHeight(),schematic.getLength()])
    for(let x = 0; x < schematic.getWidth(); ++x){
      for(let y = 0; y < schematic.getHeight(); ++y){
        for(let z = 0; z < schematic.getLength(); ++z){
          let block =  schematic.getBlockAt(x,y,z);
          switch (block){
            case "minecraft:__reserved__":block = "minecraft:air";
            case "undefined": block = "minecraft:air";
            case undefined: block =  "minecraft:air";
          }
          structure.addBlock([x,y,z],block)
        }
      }

    }

    const structureWidth = schematic.getWidth();
    const structureHeight = schematic.getHeight();
    const structureLength = schematic.getLength();

// Determine the center of the structure
    const center = [
      structureWidth / 2,
      structureHeight / 2,
      structureLength / 2,
    ];
    const distance = Math.max(structureWidth, structureHeight, structureLength) * 1.5; // Adjust the factor (1.5) to change the distance
    const cameraPosition = [
      center[0] + distance,
      center[1] + distance / 2, // Slightly above the center
      center[2] + distance / 2  // Slightly to the side to give a good view
    ];

    const width = 800;
    const height = 600;



// Create a WebGL context using headless-gl
    var glContext = gl(width, height);

    // @ts-ignore
    glContext.canvas ={
      clientWidth:width,
      clientHeight:height
    };

    let resources = res ?? await this.fetchResources();
    res = resources

// See the demo on how to create a resources object
    const renderer = new StructureRenderer(glContext, structure,resources )

    const view = mat4.create();
    // @ts-ignore
    mat4.lookAt(view, cameraPosition, center, [0, 1, 0]); // Look at the center of the structure with "up" along the Y-axis



    renderer.drawStructure(view)
    renderer.drawGrid(view)



    // Read pixels from the WebGL framebuffer
    const pixels = new Uint8Array(width * height * 4); // RGBA for each pixel
    glContext.readPixels(0, 0, width, height, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);



// Flip the pixel data vertically (WebGL's origin is bottom-left, PNG's is top-left)
    const flippedPixels = new Uint8Array(pixels.length);
    for (let row = 0; row < height; row++) {
      const srcRow = height - 1 - row; // Source row from the bottom
      flippedPixels.set(
        pixels.subarray(srcRow * width * 4, (srcRow + 1) * width * 4),
        row * width * 4
      );
    }

   return this.generateImage(flippedPixels, width, height);

  }



}
