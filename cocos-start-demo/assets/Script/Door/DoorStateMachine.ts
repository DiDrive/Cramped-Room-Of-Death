
import { _decorator, Animation, AnimationClip, Component, Event, Node, SpriteFrame } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import State from '../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../Base/StateMachine';
import { EntityManager } from '../Base/EntityManager';
import IdleSubStateMachine from './IdleSubStateMachine';
import DeadSubStateMachine from './DeadSubStateMachine';
const { ccclass, property } = _decorator;

@ccclass('DoorStateMachine')
export class DoorStateMachine extends StateMachine {

  async init(){
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()
    await Promise.all(this.waitingList)   //等待所有资源加载完成
  }


  initParams(){   //初始化参数
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,  getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.DEATH,  getInitParamsTrigger())

  }

  initStateMachine(){   //初始化状态机
    this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.DEATH, new DeadSubStateMachine(this))
  }

  initAnimationEvent(){

  }

  run(){
    switch(this.currentState){
      case  this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.DEATH):
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.DEATH)
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


