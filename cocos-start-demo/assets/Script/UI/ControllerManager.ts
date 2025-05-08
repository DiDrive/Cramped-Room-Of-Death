
import { _decorator, Component, Event, Node } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../DATA/Enums';
const { ccclass, property } = _decorator;



@ccclass('ControllerManager')
export class ControllerManager extends Component {

    handleCtrl(evt:Event, type: string){
        EventManager.Instance.emit(EVENT_ENUM.PLAY_CTRL, type as CONTROLLER_ENUM)
    }
}


