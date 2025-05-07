
import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import levels from '../../DATA/Levels';
import { TileManager } from './TileManager';
import { creatUINode, randomByRange } from '../../utils';
import DataManager from '../Runtime/DataManager';
import ResourceManager from '../Runtime/ResourceManager';



export const TILE_WIDTH = 55
export const TILE_HEIGTH = 55
@ccclass('TileMapManager')
export class TileMapManager extends Component {


   async init(){

        const spriteFrames =  await ResourceManager.Instance.loadDir("texture/tile/tile")
        const {mapInfo} = DataManager.Instance
        for(let i=0;i<mapInfo.length;i++){
            const column = mapInfo[i]
            for( let j=0;j<column.length;j++){
                const item = column[j]

                if(item.src === null || item.type === null){
                    continue
                }
                let num = item.src
                if((num === 1 || num === 5 || num === 9) && i % 2 === 0 && j % 2 === 0){
                    num += randomByRange(0,4)
                }

                const imageSrc = `tile (${num})`
                const node = creatUINode()
                const spriteFrame = spriteFrames.find(v =>v.name === imageSrc) ||spriteFrames[0]
                const tileManager = node.addComponent(TileManager)
                tileManager.init(spriteFrame,i,j)
                node.setParent(this.node)
            }

        }
    }



}


