
import { _decorator, Animation} from 'cc';
import EventManager from '../Runtime/EventManager';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../DATA/Enums';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../Base/StateMachine';
import { EntityManager } from '../Base/EntityManager';
import SpikesOneSubStateMachine from './SpikesOneSubStateMachine';
import SpikesTwoSubStateMachine from './SpikesTwoSubStateMachine';
import SpikesThreeSubStateMachine from './SpikesThreeSubStateMachine';
import SpikesFourSubStateMachine from './SpikesFourSubStateMachine';
const { ccclass, property } = _decorator;

@ccclass('SpikesStateMachine')
export class SpikesStateMachine extends StateMachine {

  async init(){
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()
    await Promise.all(this.waitingList)   //等待所有资源加载完成
  }


  initParams(){   //初始化参数
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,  getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,  getInitParamsNumber())
  }

  initStateMachine(){   //初始化状态机
    this.stateMachine.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneSubStateMachine(this))
    this.stateMachine.set(ENTITY_TYPE_ENUM.SPIKES_TWO, new SpikesTwoSubStateMachine(this))
    this.stateMachine.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikesThreeSubStateMachine(this))
    this.stateMachine.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikesFourSubStateMachine(this))
  }

  initAnimationEvent(){
    // this.animationComponent.on(Animation.EventType.FINISHED,()=>{
    //   const name =this.animationComponent.defaultClip.name
    //   const whiteList =['attack']
    //   if(whiteList.some(v => name.includes(v))){  //some() 方法会遍历数组中的每个元素，对每个元素执行回调函数，如果名字里面包含'attack'
    //     //this.setParams(PARAMS_NAME_ENUM.IDLE, true)
    //     this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
    //   }else if (name.includes('death')) {
    //     // 死亡动画播放完毕后，发送事件开启门
    //     EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
    //   }
    // })
  }

  run(){
    const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
    switch(this.currentState){
      case  this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
      case  this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_TWO):
      case  this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
      case  this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):
        if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE){
          this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
        }else if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO){
          this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_TWO)
        }else if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE){
          this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_THREE)
        }else if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR){
          this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_FOUR)
        }
        else{
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    }
  }
}


