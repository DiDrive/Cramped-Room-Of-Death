
import { _decorator, Animation} from 'cc';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
import TurnRightSubStateMachine from './TurnRightSubStateMachine';
import BlockFrontSubStateMachine from './BlockFrontSubStateMachine';
import { EntityManager } from '../Base/EntityManager';
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine';
import BlockTurnRightSubStateMachine from './BlockTurnRightSubStateMachine';
import BlockBackSubStateMachine from './BlockBackSubStateMachine';
import BlockLeftSubStateMachine from './BlockLeftSubStateMachine';
import BlockRightSubStateMachine from './BlockRightSubStateMachine';
import DeadSubStateMachine from './DeadSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import AirDeathSubStateMachine from './AirDeathSubStateMachine';
const { ccclass, property } = _decorator;

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

  async init(){
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()
    await Promise.all(this.waitingList)   //等待所有资源加载完成
  }


  initParams(){   //初始化参数
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,  getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTRUNLEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTRUNRIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKBACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.AIRDEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
  }

  initStateMachine(){   //初始化状态机
    this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKTRUNLEFT, new BlockTurnLeftSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKTRUNRIGHT, new BlockTurnRightSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKBACK, new BlockBackSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockLeftSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockRightSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.DEATH, new DeadSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.AIRDEATH, new AirDeathSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
  }

  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      const name =this.animationComponent.defaultClip.name
      const whiteList =['block','turn','attack']
      if(whiteList.some(v => name.includes(v))){  //some() 方法会遍历数组中的每个元素，对每个元素执行回调函数，如果名字里面包含'turn'
        //this.setParams(PARAMS_NAME_ENUM.IDLE, true)
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }

  run(){
    switch(this.currentState){
      case  this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKFRONT):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTRUNLEFT):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTRUNRIGHT):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKBACK):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKLEFT):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.DEATH):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.AIRDEATH):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK):
        if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){   //左转
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value){   //右转
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value){  //向前碰撞
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKFRONT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value){  //向后碰撞
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKBACK)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value){  //向左碰撞
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKLEFT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value){  //向右碰撞
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKRIGHT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTRUNLEFT).value){   //左转碰撞
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTRUNLEFT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTRUNRIGHT).value){  //右转碰撞
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTRUNRIGHT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.DEATH)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.AIRDEATH)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK)
        }
        else{
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}


