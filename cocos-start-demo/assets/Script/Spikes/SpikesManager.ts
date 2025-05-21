
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../DATA/Enums';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import { IEntity, ISpikes } from '../../DATA/Levels';
import { randomByLen } from '../../utils';
import { StateMachine } from '../Base/StateMachine';
import { SpikesStateMachine } from './SpikesStateMachine';
const { ccclass, property } = _decorator;
/***
 * 地刺陷阱
  */
@ccclass('SpikesManager')
export class SpikesManager extends Component {

    //当前x,y坐标
    id:string = randomByLen(12)
    x:number = 0
    y:number = 0
    fsm: StateMachine

    private _count: number
    private _totalCount: number
    private type: ENTITY_TYPE_ENUM

    get count(){
      return this._count
    }

    set count(newCount: number){
      this._count = newCount
      this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, newCount)
    }

    get totalCount(){
      return this._totalCount
    }

    set totalCount(newTotalCount: number){
      this._totalCount = newTotalCount
      this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, newTotalCount)
    }

    async init(params: ISpikes){

        const sprite = this.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM
        const transform = this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH * 4,TILE_HEIGTH * 4)  //设置sprite大小

        this.fsm = this.addComponent(SpikesStateMachine)
        await this.fsm.init()
        this.x = params.x
        this.y = params.y
        this.type = params.type
        this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]
        this.count =params.count
    }

    update(){
      this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH *1.5, -this.y * TILE_HEIGTH + TILE_HEIGTH *1.5)
    }

    onDestroy(){

    }

}

