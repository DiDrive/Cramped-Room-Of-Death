
import { _decorator, Component, Event, Node } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM } from '../../DATA/Enums';
import State from '../Base/State';
const { ccclass, property } = _decorator;

type ParamsValueType =boolean | number

export interface IParamasValue{
  type:FSM_PARAMS_TYPE_ENUM   //类型
  value:ParamsValueType //值
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends Component {

  private _currentState: State = null //当前状态
  params: Map<string, IParamasValue> = new Map()  //参数列表
  stateMachine: Map<string, State> = new Map()  //状态机列表

  get currentState(){
    return this._currentState
  }

  set currentState(newState: State){
    this._currentState = newState
  }
}


