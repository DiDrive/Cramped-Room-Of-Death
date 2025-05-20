
import { _decorator, animation, Animation, AnimationClip, Component, math, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../Runtime/ResourceManager';
import { EntityManager } from '../Base/EntityManager';
import DataManager from '../Runtime/DataManager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import { EnemyManager } from '../Base/EnemyManager';
import { IEntity } from '../../DATA/Levels';
const { ccclass, property } = _decorator;



@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {


    async init(params:IEntity ){
        this.fsm = this.addComponent(WoodenSkeletonStateMachine)
        await this.fsm.init()
        super.init(params)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack,this)
    }

    onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
    }

    onAttack(){
      if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
        return
      }
      const {x:playerX,y:playerY,state:playerState} = DataManager.Instance.player
      const disX = Math.abs(this.x - playerX)
      const disY = Math.abs(this.y - playerY)
      if((disX + disY <= 1) && playerState !== ENTITY_STATE_ENUM.DEATH && playerState !== ENTITY_STATE_ENUM.AIRDEATH){
        this.state = ENTITY_STATE_ENUM.ATTACK
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.DEATH)
      }else{
        this.state = ENTITY_STATE_ENUM.IDLE
      }
    }

  }


