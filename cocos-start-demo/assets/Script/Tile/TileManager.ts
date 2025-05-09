
import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import levels from '../../DATA/Levels';
import { TILE_TYPE_ENUM } from '../../DATA/Enums';


export const TILE_WIDTH = 55
export const TILE_HEIGTH = 55
@ccclass('TileManager')
export class TileManager extends Component {
    type:TILE_TYPE_ENUM
    moveable:boolean       //是否可以移动
    turnable:boolean       //是否可以旋转

    async init(type:TILE_TYPE_ENUM, spriteFrame:SpriteFrame, i:number, j:number){
        this.type = type
        if(this.type.includes("WALL")   //墙壁既不可以旋转也不可以移动
            // this.type === TILE_TYPE_ENUM.WALL_ROW ||
            // this.type === TILE_TYPE_ENUM.WALL_COLUMN ||
            // this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
            // this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
            // this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM ||
            // this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP
        ) {
            this.moveable = false
            this.turnable = false
        }else if(this.type.includes("CLIFF")){  //悬崖可以旋转，但不可以朝他移动
            this.moveable = false
            this.turnable = true
        }else if(this.type === TILE_TYPE_ENUM.FLOOR){
            this.moveable = true
            this.turnable = true
        }

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




