import {  PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from "../../DATA/Enums";
import State from "../Base/State";
import { StateMachine } from "../Base/StateMachine";
import SpikesSubStateMachine from "./SpikesSubStateMachine";

const BASE_URL = 'texture/spikes/spikesone'

export default class SpikesOneSubStateMachine extends SpikesSubStateMachine{
  constructor(fsm: StateMachine){
    super(fsm)
    this.stateMachine.set(SPIKES_COUNT_ENUM.ZERO, new State(fsm,`${BASE_URL}/zero`))
    this.stateMachine.set(SPIKES_COUNT_ENUM.ONE, new State(fsm,`${BASE_URL}/one`))
    this.stateMachine.set(SPIKES_COUNT_ENUM.TWO, new State(fsm,`${BASE_URL}/two`))
  }
}
