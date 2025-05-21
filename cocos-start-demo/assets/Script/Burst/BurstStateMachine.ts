
import { _decorator, Animation } from 'cc';
import { PARAMS_NAME_ENUM } from '../../DATA/Enums';
import State from '../Base/State';
import { getInitParamsTrigger, StateMachine } from '../Base/StateMachine';
const { ccclass, property } = _decorator;

const BASE_URL = 'texture/burst'
@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {

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
    this.params.set(PARAMS_NAME_ENUM.DEATH,  getInitParamsTrigger())

  }

  initStateMachine(){   //初始化状态机
    this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new State(this,`${BASE_URL}/idle`))
    this.stateMachine.set(PARAMS_NAME_ENUM.ATTACK, new State(this,`${BASE_URL}/attack`))
    this.stateMachine.set(PARAMS_NAME_ENUM.DEATH, new State(this,`${BASE_URL}/death`))
  }

  initAnimationEvent(){

  }

  run(){
    switch(this.currentState){
      case  this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK):
      case  this.stateMachine.get(PARAMS_NAME_ENUM.DEATH):
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
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


