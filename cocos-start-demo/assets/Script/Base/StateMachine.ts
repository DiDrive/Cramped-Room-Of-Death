
import { _decorator, Animation, AnimationClip, Component, Event, Node, SpriteFrame } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import State from '../Base/State';
import { SubStateMachine } from './SubStateMachine';
const { ccclass, property } = _decorator;

type ParamsValueType =boolean | number

export interface IParamasValue{
  type:FSM_PARAMS_TYPE_ENUM   //类型
  value:ParamsValueType //值
}

export const getInitParamsTrigger = () =>{

  return{
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

export const getInitParamsNumber = () =>{

  return{
    type: FSM_PARAMS_TYPE_ENUM.NUMBER,
    value: 0,
  }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {

  private _currentState: State | SubStateMachine = null //当前状态
  params: Map<string, IParamasValue> = new Map()  //参数列表
  stateMachine: Map<string, State | SubStateMachine> = new Map()  //状态机列表
  animationComponent: Animation
  waitingList: Array<Promise<SpriteFrame[]>> = []   //异步加载等待列表

  get currentState(){
    return this._currentState
  }

  set currentState(newState: State | SubStateMachine){
    this._currentState = newState
    this._currentState.run()
  }

  //重置触发器
  resetTrigger(){
    for(const [_, value] of this.params){
      if(value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER){
        value.value = false
      }
    }
  }

  getParams(paramsName: string){
    if(this.params.has(paramsName)){
      return this.params.get(paramsName).value
    }
  }

  setParams(paramsName: string, value: ParamsValueType){
    if(this.params.has(paramsName)){
      this.params.get(paramsName).value = value
      this.run()
      this.resetTrigger()
    }
  }

  abstract init(): void
  abstract run(): void
}


