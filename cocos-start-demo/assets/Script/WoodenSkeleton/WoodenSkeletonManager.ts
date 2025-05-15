
import { _decorator, animation, Animation, AnimationClip, Component, math, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../Runtime/ResourceManager';
import { EntityManager } from '../Base/EntityManager';
import DataManager from '../Runtime/DataManager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
const { ccclass, property } = _decorator;



@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {


    async init(){
        this.fsm = this.addComponent(WoodenSkeletonStateMachine)
        await this.fsm.init()
        super.init({
          x:2,
          y:4,
          type:ENTITY_TYPE_ENUM.PLAYER,
          direction:DIRECTION_ENUM.UP,
          state:ENTITY_STATE_ENUM.IDLE
        })
        EventManager.Instance.on(EVENT_ENUM.PLAER_BRON, this.onChangeDirection,this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection,this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack,this)
        this.onChangeDirection(true)
    }

    //改变怪物的朝向
    onChangeDirection(isInit:boolean = false){
      if(!DataManager.Instance.player){
        return
      }
      const {x:playerX,y:playerY} = DataManager.Instance.player
      const disX = Math.abs(this.x - playerX)
      const disY = Math.abs(this.y - playerY)

      if(disX === disY && !isInit){   //在对角线上且不是游戏刚出生，怪物不转向
        return
      }

      if(playerX >= this.x && playerY <= this.y){   //player在第一象限
        this.direction = disX >disY ? DIRECTION_ENUM.RIGHT :DIRECTION_ENUM.UP
      }else if(playerX <= this.x && playerY <= this.y){   //player在第二象限
        this.direction = disX >disY ? DIRECTION_ENUM.LEFT :DIRECTION_ENUM.UP
      }else if(playerX <= this.x && playerY >= this.y){   //player在第三象限
        this.direction = disX >disY ? DIRECTION_ENUM.LEFT :DIRECTION_ENUM.DOWN
      }else if(playerX >= this.x && playerY >= this.y){   //player在第四象限
        this.direction = disX >disY ? DIRECTION_ENUM.RIGHT :DIRECTION_ENUM.DOWN
      }
    }

    onAttack(){
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


