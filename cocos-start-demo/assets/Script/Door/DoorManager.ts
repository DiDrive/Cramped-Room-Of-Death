
import { _decorator, animation, Animation, AnimationClip, Component, math, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../Runtime/ResourceManager';
import { EntityManager } from '../Base/EntityManager';
import DataManager from '../Runtime/DataManager';
import { DoorStateMachine } from './DoorStateMachine';
import { IEntity } from '../../DATA/Levels';
const { ccclass, property } = _decorator;



@ccclass('DoorManager')
export class DoorManager extends EntityManager {


    async init(params:IEntity){
        this.fsm = this.addComponent(DoorStateMachine)
        await this.fsm.init()
        super.init(params)
        EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen,this)

    }

    onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen)

    }

    onOpen(){
      if(DataManager.Instance.enemies.every(enemy => enemy.state === ENTITY_STATE_ENUM.DEATH && this.state !== ENTITY_STATE_ENUM.DEATH)){
        this.state = ENTITY_STATE_ENUM.DEATH
      }
    }

  }


