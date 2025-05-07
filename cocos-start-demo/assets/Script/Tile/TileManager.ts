
import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import levels from '../../DATA/Levels';


export const TILE_WIDTH = 55
export const TILE_HEIGTH = 55
@ccclass('TileManager')
export class TileManager extends Component {


   async init(spriteFrame:SpriteFrame,i:number,j:number){


                const sprite =  this.addComponent(Sprite)
                //const imageSrc = `tile (${item.src})`
                sprite.spriteFrame = spriteFrame
                const transform = this.getComponent(UITransform)
                transform.setContentSize(TILE_WIDTH,TILE_HEIGTH)
                // console.log(Layers.nameToLayer("UI_2D"))
                //console.log(1<<Layers.nameToLayer("UI_2D"))

                this.node.setPosition(i*TILE_WIDTH,-j*TILE_HEIGTH)


        }
    }




