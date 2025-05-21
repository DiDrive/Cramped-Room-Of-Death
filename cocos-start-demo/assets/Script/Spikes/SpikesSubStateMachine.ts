import {  PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from "../../DATA/Enums";
import { SubStateMachine } from "../Base/SubStateMachine";



export default class SpikesSubStateMachine extends SubStateMachine{

  run(){
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState = this.stateMachine.get(SPIKES_COUNT_MAP_NUMBER_ENUM[value as number])
  }

}
