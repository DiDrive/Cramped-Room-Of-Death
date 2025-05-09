import {DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../../DATA/Enums";

import { SubStateMachine } from "../Base/SubStateMachine";

const BASE_URL = 'texture/player/idle'

export default class DirectionSubStateMachine extends SubStateMachine{
  run(){
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
    this.currentState = this.stateMachine.get(DIRECTION_ORDER_ENUM[value as number])
  }
}
