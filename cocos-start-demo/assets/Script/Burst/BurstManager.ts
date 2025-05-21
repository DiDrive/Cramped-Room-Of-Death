
import { _decorator, UITransform} from 'cc';
import EventManager from '../Runtime/EventManager';
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../DATA/Enums';
import DataManager from '../Runtime/DataManager';
import { EnemyManager } from '../Base/EnemyManager';
import { IEntity } from '../../DATA/Levels';
import { BurstStateMachine } from './BurstStateMachine';
import { EntityManager } from '../Base/EntityManager';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
const { ccclass, property } = _decorator;



@ccclass('BurstManager')
export class BurstManager extends EntityManager {


    async init(params:IEntity ){
        this.fsm = this.addComponent(BurstStateMachine)
        await this.fsm.init()
        super.init(params)
        const transform = this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH ,TILE_HEIGTH )  //设置sprite大小
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst,this)
    }

    onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)
    }

    update(){
      this.node.setPosition(this.x * TILE_WIDTH , -this.y * TILE_HEIGTH)  //burst不需要偏移，重写EntityManager中的update
    }

    onBurst(){
      if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
        return
      }
      const {x:playerX,y:playerY} = DataManager.Instance.player
      if(this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE){
        this.state = ENTITY_STATE_ENUM.ATTACK
      }else if(this.state === ENTITY_STATE_ENUM.ATTACK){
        this.state = ENTITY_STATE_ENUM.DEATH
        if(this.x === playerX && this.y === playerY){
          EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.AIRDEATH)
        }
      }
    }
  }


