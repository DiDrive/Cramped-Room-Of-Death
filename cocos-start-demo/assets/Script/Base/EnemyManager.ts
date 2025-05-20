
import { _decorator, animation, Animation, AnimationClip, Component, math, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../Runtime/ResourceManager';
import { EntityManager } from '../Base/EntityManager';
import DataManager from '../Runtime/DataManager';
import { IEntity } from '../../DATA/Levels';
const { ccclass, property } = _decorator;



@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {


    async init(params:IEntity){
        super.init(params)
        EventManager.Instance.on(EVENT_ENUM.PLAER_BRON, this.onChangeDirection,this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection,this)
        EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead,this)
        this.onChangeDirection(true)
    }

    onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAER_BRON, this.onChangeDirection)
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
      EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
    }

    //改变怪物的朝向
    onChangeDirection(isInit:boolean = false){
      if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
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


    onDead(id:string){
      if(this.state === ENTITY_STATE_ENUM.DEATH){
        return
      }
      if(this.id === id){
        this.state = ENTITY_STATE_ENUM.DEATH
      }
    }
  }


