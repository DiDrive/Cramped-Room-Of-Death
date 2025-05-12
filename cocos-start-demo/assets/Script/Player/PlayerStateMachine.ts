
import { _decorator, Animation, AnimationClip, Component, Event, Node, SpriteFrame } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import State from '../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
import TurnRightSubStateMachine from './TurnRightSubStateMachine';
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
  }

  initStateMachine(){   //初始化状态机
    this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this))
  }

  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      const name =this.animationComponent.defaultClip.name
      const whiteList =['turn']
      if(whiteList.some(v => name.includes(v))){  //some() 方法会遍历数组中的每个元素，对每个元素执行回调函数，如果名字里面包含'turn'
        this.setParams(PARAMS_NAME_ENUM.IDLE, true)
      }
    })
  }

  run(){
    switch(this.currentState){
      case  this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
        if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
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


