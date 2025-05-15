
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import { IEntity } from '../../DATA/Levels';
import { StateMachine } from './StateMachine';
const { ccclass, property } = _decorator;
/***
 * 实体基类
  */
@ccclass('EntityManager')
export class EntityManager extends Component {

    //当前x,y坐标
    x:number = 0
    y:number = 0
    fsm: StateMachine

    private _direction: DIRECTION_ENUM
    private _state: ENTITY_STATE_ENUM
    private type: ENTITY_TYPE_ENUM

    get direction(){
      return this._direction
    }

    set direction(newDirection: DIRECTION_ENUM){
      this._direction = newDirection
      this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
    }

    get state(){
      return this._state
    }

    set state(newState: ENTITY_STATE_ENUM){
      this._state = newState
      this.fsm.setParams(this._state, true)
    }

    async init(params: IEntity){

        const sprite = this.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM
        const transform = this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH * 4,TILE_HEIGTH * 4)  //设置sprite大小
        this.x = params.x
        this.y = params.y
        this.type = params.type
        this.direction = params.direction //方向
        this.state = params.state //状态
    }

    update(){
      this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH *1.5, -this.y * TILE_HEIGTH + TILE_HEIGTH *1.5)
    }


}

