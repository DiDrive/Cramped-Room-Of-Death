
import { _decorator, Animation, AnimationClip, Component, Event, Node, SpriteFrame } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import State from '../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import { EntityManager } from '../Base/EntityManager';
import DeadSubStateMachine from './DeadSubStateMachine';
const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {

  async init(){
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()
    await Promise.all(this.waitingList)   //等待所有资源加载完成
  }


  initParams(){   //初始化参数
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,  getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.DEATH,  getInitParamsTrigger())

  }

  initStateMachine(){   //初始化状态机
    this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
    this.stateMachine.set(PARAMS_NAME_ENUM.DEATH, new DeadSubStateMachine(this))
  }

  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      const name =this.animationComponent.defaultClip.name
      const whiteList =['attack']
      if(whiteList.some(v => name.includes(v))){  //some() 方法会遍历数组中的每个元素，对每个元素执行回调函数，如果名字里面包含'attack'
        //this.setParams(PARAMS_NAME_ENUM.IDLE, true)
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }else if (name.includes('death')) {
        // 死亡动画播放完毕后，发送事件开启门
        EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
      }
    })
  }

  run(){
    switch(this.currentState){
      case  this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.DEATH):
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
        }else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK)
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


