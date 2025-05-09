
import { _decorator, Animation, AnimationClip, Component, Event, Node, SpriteFrame } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import State from '../Base/State';
import { StateMachine } from './StateMachine';
const { ccclass, property } = _decorator;

@ccclass('SubStateMachine')
export abstract class SubStateMachine{

  private _currentState: State = null //当前状态
  stateMachine: Map<string, State> = new Map()  //状态机列表

  constructor(public fsm: StateMachine){

  }
  get currentState(){
    return this._currentState
  }

  set currentState(newState: State){
    this._currentState = newState
    this._currentState.run()
  }


  abstract run(): void
}


